// Stripe Configuration for Blood Bank App
// Handles payment processing for money donations and organization subscriptions

import Constants from 'expo-constants';

// Debug Stripe configuration
console.log('🔧 Stripe Config Debug:', {
  expoConfig: Constants.expoConfig?.extra?.stripePublishableKey,
  envVar: process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  hasExpoConfig: !!Constants.expoConfig?.extra?.stripePublishableKey,
  hasEnvVar: !!process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY,
});

// Stripe Configuration
export const STRIPE_CONFIG = {
  // Client-side publishable key (safe to expose)
  publishableKey: Constants.expoConfig?.extra?.stripePublishableKey || 
                  process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || 
                  'pk_test_your_stripe_publishable_key_here',
  
  // Backend URL for server-side operations
  backendUrl: Constants.expoConfig?.extra?.backendUrl as string | undefined || 
              process.env.EXPO_PUBLIC_BACKEND_URL || 
              'https://c11e44b3e839.ngrok-free.app/api',
  
  // API Version
  apiVersion: '2023-10-16' as const,
};

console.log('🔧 Final Stripe Config:', {
  publishableKey: STRIPE_CONFIG.publishableKey?.substring(0, 20) + '...',
  backendUrl: STRIPE_CONFIG.backendUrl,
  isValid: STRIPE_CONFIG.publishableKey.startsWith('pk_test_') || STRIPE_CONFIG.publishableKey.startsWith('pk_live_'),
});

// Stripe Product Configuration
export const STRIPE_PRODUCTS = {
  // Organization Subscription Plans
  subscriptions: {
    basic: {
      priceId: 'price_basic_monthly', // Replace with actual Stripe price ID
      amount: 250000, // PKR 2,500 in cents
      currency: 'pkr',
      interval: 'month',
      name: 'Basic Plan',
      features: ['Featured listing', 'Unlimited drives', 'Priority support', 'Analytics dashboard'],
    },
    premium: {
      priceId: 'price_premium_monthly', // Replace with actual Stripe price ID
      amount: 500000, // PKR 5,000 in cents
      currency: 'pkr',
      interval: 'month',
      name: 'Premium Plan',
      features: ['Top placement', 'Custom branding', 'Dedicated support', 'Advanced analytics', 'API access'],
    },
  },
  
  // Money Donation Configuration
  donations: {
    currency: 'pkr',
    minimumAmount: 10000, // PKR 100 in cents
    maximumAmount: 100000000, // PKR 1,000,000 in cents
    suggestedAmounts: [10000, 25000, 50000, 100000, 250000, 500000], // In cents
  },
};

// Stripe Success/Cancel URLs for checkout sessions
export const STRIPE_URLS = {
  // Money Donations
  donationSuccess: '/donations?payment=success',
  donationCancel: '/donations?payment=cancelled',
  
  // Organization Subscriptions
  subscriptionSuccess: '/org/settings?subscription=success',
  subscriptionCancel: '/org/settings?subscription=cancelled',
  
  // Customer Portal (for managing subscriptions)
  customerPortal: '/org/settings',
};

// Helper function to format currency amounts
export const formatCurrency = (amountInCents: number, currency: string = 'PKR'): string => {
  const amount = amountInCents / 100;
  return `${currency} ${amount.toLocaleString()}`;
};

// Helper function to convert PKR to cents for Stripe
export const pkrToCents = (pkrAmount: number): number => {
  return Math.round(pkrAmount * 100);
};

// Helper function to convert cents to PKR
export const centsToPkr = (cents: number): number => {
  return cents / 100;
};

// Validate Stripe configuration
export const validateStripeConfig = (): boolean => {
  const { publishableKey, backendUrl } = STRIPE_CONFIG;
  
  if (!publishableKey || publishableKey.startsWith('pk_test_...')) {
    console.warn('⚠️  Stripe publishable key not configured properly');
    return false;
  }
  
  if (!backendUrl || backendUrl.includes('your-backend')) {
    console.warn('⚠️  Backend URL not configured properly');
    return false;
  }
  
  return true;
};

// Error messages for Stripe-related errors
export const STRIPE_ERRORS = {
  CONFIGURATION_ERROR: 'Payment system is not properly configured. Please contact support.',
  NETWORK_ERROR: 'Unable to connect to payment service. Please check your internet connection.',
  PAYMENT_FAILED: 'Payment failed. Please try again or use a different payment method.',
  SUBSCRIPTION_ERROR: 'Unable to process subscription. Please try again later.',
  INSUFFICIENT_FUNDS: 'Payment failed due to insufficient funds.',
  CARD_DECLINED: 'Your card was declined. Please try a different payment method.',
  EXPIRED_CARD: 'Your card has expired. Please use a different payment method.',
  INVALID_CARD: 'Invalid card information. Please check your details and try again.',
  PROCESSING_ERROR: 'Payment is being processed. Please wait a moment.',
  CANCELLED: 'Payment was cancelled by user.',
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
};

// Map Stripe error codes to user-friendly messages
export const getStripeErrorMessage = (errorCode?: string, errorType?: string): string => {
  switch (errorCode) {
    case 'card_declined':
      return STRIPE_ERRORS.CARD_DECLINED;
    case 'expired_card':
      return STRIPE_ERRORS.EXPIRED_CARD;
    case 'insufficient_funds':
      return STRIPE_ERRORS.INSUFFICIENT_FUNDS;
    case 'invalid_cvc':
    case 'invalid_expiry_month':
    case 'invalid_expiry_year':
    case 'invalid_number':
      return STRIPE_ERRORS.INVALID_CARD;
    case 'processing_error':
      return STRIPE_ERRORS.PROCESSING_ERROR;
    default:
      switch (errorType) {
        case 'card_error':
          return STRIPE_ERRORS.PAYMENT_FAILED;
        case 'api_connection_error':
          return STRIPE_ERRORS.NETWORK_ERROR;
        case 'api_error':
        case 'authentication_error':
        case 'invalid_request_error':
          return STRIPE_ERRORS.CONFIGURATION_ERROR;
        default:
          return STRIPE_ERRORS.UNKNOWN_ERROR;
      }
  }
};

export default STRIPE_CONFIG;
