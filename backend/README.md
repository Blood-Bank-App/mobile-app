# Blood Bank Backend - Stripe Integration

This Node.js backend handles all Stripe payment processing for the Blood Bank app, keeping sensitive operations server-side for security.

## Features

- **Stripe Payment Intents**: Create secure payment intents for money donations
- **Webhook Handling**: Process Stripe webhooks for payment confirmations
- **Firebase Integration**: Record completed donations in Firebase
- **Security**: All Stripe secret key operations handled server-side
- **Error Handling**: Comprehensive error handling and logging

## Environment Variables

Copy `env.example` to `.env` and configure:

```bash
cp env.example .env
```

Required variables:
- `STRIPE_SECRET_KEY`: Your Stripe secret key
- `STRIPE_WEBHOOK_SECRET`: Stripe webhook endpoint secret
- `FIREBASE_SERVICE_ACCOUNT`: Firebase service account JSON
- `FIREBASE_DATABASE_URL`: Firebase Realtime Database URL

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

## Production

```bash
npm run build
npm start
```

## API Endpoints

### POST /api/create-payment-intent

Create a Stripe payment intent for money donations.

**Request Body:**
```json
{
  "amount": 50000,
  "currency": "pkr",
  "purpose": "platform_support",
  "userId": "user123",
  "userEmail": "user@example.com"
}
```

**Response:**
```json
{
  "clientSecret": "pi_xxx_secret_xxx",
  "paymentIntentId": "pi_xxx"
}
```

### POST /api/webhook

Stripe webhook endpoint for payment confirmations.

### GET /api/health

Health check endpoint.

## Stripe Webhook Setup

1. Install Stripe CLI: `npm install -g stripe`
2. Login: `stripe login`
3. Forward webhooks: `stripe listen --forward-to localhost:3000/api/webhook`
4. Copy the webhook secret to your `.env` file

## Deployment

Deploy to Heroku, Railway, or similar:

```bash
# Heroku
heroku create your-app-name
heroku config:set STRIPE_SECRET_KEY=sk_live_...
heroku config:set STRIPE_WEBHOOK_SECRET=whsec_...
heroku config:set FIREBASE_SERVICE_ACCOUNT='{"type":"service_account",...}'
git push heroku main
```

## Security Notes

- Never expose Stripe secret keys to the client
- Always validate webhook signatures
- Use HTTPS in production
- Implement rate limiting for production use
- Monitor webhook events for failed payments
