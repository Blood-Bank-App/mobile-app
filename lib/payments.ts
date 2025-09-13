import { getBackendBaseUrl } from '@/config/stripe';

type CreatePaymentIntentInput = { amount: number; currency?: string; purpose?: string };

export async function createPaymentIntent(input: CreatePaymentIntentInput) {
  const res = await fetch(`${getBackendBaseUrl()}/api/create-payment-intent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input)
  });
  if (!res.ok) throw new Error(`create-payment-intent failed: ${res.status}`);
  return res.json() as Promise<{ clientSecret: string; paymentIntentId: string }>;
}

