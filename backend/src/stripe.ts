import admin from 'firebase-admin';
import Stripe from 'stripe';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export interface CreatePaymentIntentRequest {
  amount: number; // Amount in cents
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
  request: CreatePaymentIntentRequest
): Promise<CreatePaymentIntentResponse> {
  const { amount, currency = 'pkr', purpose, userId, userEmail } = request;

  // Validate amount (minimum PKR 100)
  if (amount < 10000) { // 100 PKR in cents
    throw new Error('Minimum donation amount is PKR 100');
  }

  // Validate maximum amount (PKR 1,000,000)
  if (amount > 100000000) { // 1,000,000 PKR in cents
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
export async function handleWebhook(event: Stripe.Event): Promise<void> {
  switch (event.type) {
    case 'payment_intent.succeeded':
      await handlePaymentSuccess(event.data.object as Stripe.PaymentIntent);
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
async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent): Promise<void> {
  try {
    const { userId, userEmail, purpose } = paymentIntent.metadata;
    
    if (!userId) {
      console.error('No userId in payment intent metadata');
      return;
    }

    // Record the donation in Firebase
    const donationRef = admin.database().ref(`money_donations/${userId}`).push();
    const donationId = donationRef.key;

    const donationData = {
      id: donationId,
      uid: userId,
      amount: paymentIntent.amount / 100, // Convert cents to PKR
      currency: paymentIntent.currency.toUpperCase(),
      purpose: purpose || 'general',
      createdAt: Date.now(),
      stripePaymentId: paymentIntent.id,
      stripeSessionId: paymentIntent.id,
      receiptUrl: `https://dashboard.stripe.com/payments/${paymentIntent.id}`,
    };

    await donationRef.set(donationData);
    
    console.log(`✅ Donation recorded for user ${userId}: ${donationId}`);
    
    // Optional: Send confirmation email or push notification
    // await sendDonationConfirmation(userId, donationData);
    
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
  
  // Optional: Log failed payment for analysis
  // await logFailedPayment(paymentIntent);
  
  // Optional: Send failure notification to user
  // await notifyPaymentFailure(paymentIntent.metadata.userId, paymentIntent.last_payment_error);
}

/**
 * Get Stripe customer portal session (for managing subscriptions/payments)
 */
export async function createCustomerPortalSession(customerId: string, returnUrl: string): Promise<string> {
  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });

    return session.url;
  } catch (error: any) {
    console.error('Error creating customer portal session:', error);
    throw new Error(`Failed to create customer portal: ${error.message}`);
  }
}

/**
 * Validate webhook signature
 */
export function validateWebhookSignature(
  payload: string | Buffer,
  signature: string,
  secret: string
): Stripe.Event {
  try {
    return stripe.webhooks.constructEvent(payload, signature, secret);
  } catch (error: any) {
    console.error('Webhook signature validation failed:', error);
    throw new Error(`Webhook signature validation failed: ${error.message}`);
  }
}
