import Stripe from 'stripe';

export interface Env {
  STRIPE_SECRET_KEY: string;
  FIREBASE_SERVICE_ACCOUNT: string;
  FIREBASE_DATABASE_URL: string;
}

export interface CreatePaymentIntentRequest {
  amount: number;
  currency?: string;
  purpose?: string;
  userId: string;
  userEmail?: string;
}

export interface CreatePaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
}

/**
 * Create a Stripe payment intent for money donations
 */
export async function createPaymentIntent(
  request: CreatePaymentIntentRequest,
  env: Env
): Promise<CreatePaymentIntentResponse> {
  const { amount, currency = 'pkr', purpose, userId, userEmail } = request;

  // Initialize Stripe with environment variable
  const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
    apiVersion: '2023-10-16',
  });

  // Validate amount (minimum PKR 100)
  if (amount < 10000) {
    throw new Error('Minimum donation amount is PKR 100');
  }

  // Validate maximum amount (PKR 1,000,000)
  if (amount > 100000000) {
    throw new Error('Maximum donation amount is PKR 1,000,000');
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: currency.toLowerCase(),
      metadata: {
        userId,
        userEmail: userEmail || '',
        purpose: purpose || 'general',
        type: 'money_donation',
      },
      description: `Blood Bank Donation - ${purpose || 'General'}`,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return {
      clientSecret: paymentIntent.client_secret!,
      paymentIntentId: paymentIntent.id,
    };
  } catch (error: any) {
    console.error('Stripe payment intent creation failed:', error);
    throw new Error(`Payment creation failed: ${error.message}`);
  }
}

/**
 * Handle Stripe webhook events
 */
export async function handleWebhook(event: Stripe.Event, env: Env): Promise<void> {
  switch (event.type) {
    case 'payment_intent.succeeded':
      await handlePaymentSuccess(event.data.object as Stripe.PaymentIntent, env);
      break;
    
    case 'payment_intent.payment_failed':
      await handlePaymentFailure(event.data.object as Stripe.PaymentIntent);
      break;
    
    default:
      console.log(`Unhandled webhook event type: ${event.type}`);
  }
}

/**
 * Handle successful payment and record donation
 */
async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent, env: Env): Promise<void> {
  try {
    const { userId, userEmail, purpose } = paymentIntent.metadata;
    
    if (!userId) {
      console.error('No userId in payment intent metadata');
      return;
    }

    // For Cloudflare Workers, we'll use a simple HTTP request to Firebase
    // instead of the Firebase Admin SDK
    const donationData = {
      id: `donation_${Date.now()}`,
      uid: userId,
      amount: paymentIntent.amount / 100,
      currency: paymentIntent.currency.toUpperCase(),
      purpose: purpose || 'general',
      createdAt: Date.now(),
      stripePaymentId: paymentIntent.id,
      stripeSessionId: paymentIntent.id,
      receiptUrl: `https://dashboard.stripe.com/payments/${paymentIntent.id}`,
    };

    // Record donation in Firebase using REST API
    const firebaseUrl = `${env.FIREBASE_DATABASE_URL}/money_donations/${userId}.json`;
    await fetch(firebaseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(donationData),
    });
    
    console.log(`✅ Donation recorded for user ${userId}`);
    
  } catch (error) {
    console.error('❌ Error recording donation:', error);
    throw error;
  }
}

/**
 * Handle failed payment
 */
async function handlePaymentFailure(paymentIntent: Stripe.PaymentIntent): Promise<void> {
  console.log(`❌ Payment failed for ${paymentIntent.id}:`, paymentIntent.last_payment_error);
}

/**
 * Validate webhook signature
 */
export function validateWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): Stripe.Event {
  const stripe = new Stripe('', { apiVersion: '2023-10-16' });
  
  try {
    return stripe.webhooks.constructEvent(payload, signature, secret);
  } catch (error: any) {
    console.error('Webhook signature validation failed:', error);
    throw new Error(`Webhook signature validation failed: ${error.message}`);
  }
}
