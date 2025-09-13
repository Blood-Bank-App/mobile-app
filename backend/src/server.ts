import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import Stripe from 'stripe';

const app = express();
const port = process.env.PORT || 3001;
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2024-06-20' });

app.use(cors({ origin: '*'}));
app.use(express.json());

app.get('/api/health', (_, res) => res.json({ ok: true }));

app.post('/api/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency = 'pkr', purpose } = req.body as { amount: number; currency?: string; purpose?: string };
    if (!amount || amount <= 0) return res.status(400).json({ error: 'Invalid amount' });
    const pi = await stripe.paymentIntents.create({ amount, currency, metadata: { purpose: purpose || 'donation' } });
    return res.json({ clientSecret: pi.client_secret, paymentIntentId: pi.id });
  } catch (e: any) {
    console.error(e);
    return res.status(500).json({ error: 'server_error' });
  }
});

// Minimal webhook placeholder (not verifying in dev)
app.post('/api/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  res.json({ received: true });
});

app.listen(port, () => {
  console.log(`Backend listening on port ${port}`);
});

