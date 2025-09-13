# BloodBank App (Expo + Firebase + Stripe)

## Prerequisites
- Node 18+
- pnpm (recommended) or npm/yarn
- Expo CLI

## Setup
1. Install deps:
   ```bash
   pnpm install
   pnpm --filter ./backend install
   ```
2. Configure app keys in `app.json` → `extra.firebase` and `extra.stripe.publishableKey`.
3. Configure backend env in `.env` under `backend/`:
   ```bash
   STRIPE_SECRET_KEY=sk_test_your_key
   PORT=3001
   ```
4. Run backend:
   ```bash
   pnpm --filter ./backend dev
   ```
5. Run app:
   ```bash
   pnpm start
   ```

## Scripts
- `pnpm seed` to push dev seed data (set `FIREBASE_DATABASE_URL` in env).

## Notes
- All Firebase access is via `lib/*` modules.
- Header includes Donor/Patient mode switch and Donor availability toggle.
- Money donations integrate Stripe via backend `/api/create-payment-intent`.
