import { createPaymentIntent, handleWebhook, validateWebhookSignature } from './stripe-worker';

export interface Env {
  STRIPE_SECRET_KEY: string;
  STRIPE_WEBHOOK_SECRET: string;
  FIREBASE_SERVICE_ACCOUNT: string;
  FIREBASE_DATABASE_URL: string;
  ALLOWED_ORIGINS: string;
  ENVIRONMENT: string;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': env.ALLOWED_ORIGINS || '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': 'true',
    };

    // Handle preflight requests
    if (method === 'OPTIONS') {
      return new Response(null, { status: 200, headers: corsHeaders });
    }

    try {
      // Health check endpoint
      if (path === '/api/health' && method === 'GET') {
        return new Response(JSON.stringify({
          status: 'healthy',
          timestamp: new Date().toISOString(),
          version: '1.0.0',
          environment: env.ENVIRONMENT || 'development'
        }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // Create payment intent endpoint
      if (path === '/api/create-payment-intent' && method === 'POST') {
        const body = await request.json();
        
        try {
          const result = await createPaymentIntent({
            amount: body.amount,
            currency: body.currency || 'pkr',
            purpose: body.purpose,
            userId: body.userId,
            userEmail: body.userEmail
          }, env);

          return new Response(JSON.stringify(result), {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        } catch (error: any) {
          return new Response(JSON.stringify({
            error: error.message || 'Failed to create payment intent'
          }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }
      }

      // Stripe webhook endpoint
      if (path === '/api/webhook' && method === 'POST') {
        const signature = request.headers.get('stripe-signature');
        const body = await request.text();

        if (!signature || !env.STRIPE_WEBHOOK_SECRET) {
          return new Response('Missing webhook signature or secret', { status: 400 });
        }

        try {
          const event = validateWebhookSignature(body, signature, env.STRIPE_WEBHOOK_SECRET);
          await handleWebhook(event, env);
          
          return new Response(JSON.stringify({ received: true }), {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        } catch (error: any) {
          console.error('Webhook error:', error);
          return new Response(`Webhook Error: ${error.message}`, { status: 400 });
        }
      }

      // 404 for unknown endpoints
      return new Response(JSON.stringify({ error: 'Endpoint not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });

    } catch (error: any) {
      console.error('Unhandled error:', error);
      return new Response(JSON.stringify({
        error: 'Internal server error',
        message: env.ENVIRONMENT === 'development' ? error.message : 'Something went wrong'
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  },
};
