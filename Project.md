### Blood Donation App – Full Plan (React Native Expo & Firebase)

This document is the canonical reference for product behavior, data flow, and implementation details.

#### Core Objectives
- Save lives via fast donor matching (city, blood group, availability).
- Trust & Safety via verified donors, hospitals, NGOs.
- Sustainability via optional paid features (priority requests, hospital/NGO subscriptions).

#### User Roles
- Donor: register, mark availability, donate blood/money.
- Receiver (Patient/Family): create requests, contact donors.
- Hospital/NGO: manage drives, verify requests.
- Admin: monitor, prevent fraud.

#### Navigation (expo-router)
- Auth stack: `/auth/login`, `/auth/signup`, `/auth/reset`, `/auth/onboarding`.
- Tabs: `/(tabs)/home`, `/(tabs)/donors` (Patient only), `/(tabs)/request` (Patient only), `/(tabs)/donate`, `/(tabs)/history`, `/(tabs)/profile`, `/(tabs)/inbox` (Donor only).
    -In expo {tabs} navigation showing by detail with file name. we can overcome this with _layout.tsx file but there could be an issue when we showing menu conditionally it will with default routing.
- Details: `/request`, `/request/[id]`, `/profile/[uid]`, `/donations`, `/donations/add`, `/+not-found`.
- Auth Guard: tabs require authentication; logged-out users redirect to `/auth/login`.
misplace
#### App Modes & Header Actions
- Mode Switch: Donor/Patient toggle in `/(tabs)/profile` and surfaced in dashboard header for quick access. Mode changes emphasis/visibility of screens; permissions unchanged.
- Availability Toggle (Donors): quick switch in dashboard header and on Profile. Updates `users/{uid}/available` immediately; used by Donor List filtering and Inbox logic. Only visible when user is in Donor mode.

#### Mode Switching Behavior
- **Donor Mode**: Emphasizes donation-related features
  - Hides Donors List tab (not applicable for donors)
  - Hides Request Blood tab (not applicable for donors)
  - Shows Donor Inbox tab (Request To Me, All Requests)
  - Displays availability toggle in header and profile
  - Highlights "Become a Donor" actions and donation history
  - Shows donor-specific statistics and badges
  - Enables accepting urgent requests from dashboard
- **Patient Mode**: Emphasizes request-related features
  - Shows Donors List tab (find available donors)
  - Shows Request Blood tab (create blood requests)
  - Hides Donor Inbox tab
  - Hides availability toggle (not applicable)
  - Emphasizes "Request Blood" actions and request history
  - Shows patient-specific request management tools
  - Focuses on finding donors and managing requests
- **Mode Persistence**: User's selected mode persists across app sessions via local storage
- **Default Mode**: New users default to Patient mode; can switch during onboarding

#### Dashboard Header Layout
- Header structure (left to right): App logo/branding (left), Screen title (center), Action buttons (right)
- Action buttons area: Mode switch (Donor/Patient toggle), Availability toggle (donors only), spacing between elements
- Minimum header height: 60px to accommodate toggle switches without text overlap
- Action buttons should have adequate padding (8px minimum between elements)
- Screen title should be truncated with ellipsis if it conflicts with action buttons
- On smaller screens, consider showing only availability toggle and hide mode switch (accessible via Profile)

#### Screens & Flows
- Signup
  - Use auth layout. Show logo top-center with app name.
  - Inputs: Email, Password. Secondary: Login link.
  - On success: reset form, navigate to Onboarding.
- Login
  - Use auth layout. Logo top-center.
  - Inputs: Email, Password. Links: Create account, Forgot password.
  - If onboarding incomplete: redirect to Onboarding.
  - disable button and show loader while signing..
- Reset Password
  - Use auth layout. Input: Email. Button: Send Reset Email.
- Onboarding Profile (after signup/login)
  - Use auth layout; pre-fill available info.
  - Inputs: Full Name, Email (optional), Gender, Phone (+92 validation), Blood Group, City, CNIC (optional), Mode Selection (Donor/Patient radio buttons or toggle), Available as Donor (toggle - only visible if Donor mode selected).
  - Button: Save & Continue → navigate to Home (tabs).
  - Mode Selection: Defaults to Patient; explain benefits of each mode with brief descriptions
- Complete Profile (first login if incomplete)
  - Same fields as Onboarding; Email may be read-only if verified.
  - Include Mode Selection if not previously set
  - Availability toggle only shown for Donor mode selection
- Home (Dashboard)
  - Sections: Search (by blood group, city), Urgent Requests (patient name, city, blood group, time), Find Donors CTA.
  - Buttons: Request Blood (primary), Become a Donor.
  - Header: App branding; Mode toggle (Donor/Patient); Availability toggle (donors only).
  - **Urgent Requests Section** (Donors and NGOs only): 
    - Displays recent high-priority requests with countdown timers
    - Cards show patient name, blood group, city, hospital, time posted
    - Action buttons: "View Details" (opens full request), "Accept" (donors only)
    - "Accept" immediately assigns donor and updates request status to accepted
    - Only visible when user is in Donor mode or associated with an NGO
- Donor List
  - Show users marked available as donors.
  - Filters: Blood Group (multi-select), City, Availability (active only).
  - Cards: profile image, name, blood group, city, gender; actions (Call/SMS/WhatsApp/Request).
  - "Request" opens Request Blood with `requestedTo` prefilled.
- Request Blood
  - If `requested_to` provided: create targeted request; status `pending` until donor accepts/rejects. Notify donor (WhatsApp/push/deeplink).
  - If no `requested_to`: create general request; status `open` for donors to accept.
  - Inputs: Patient Name (default: current user's name), Required Blood Group (default: user's group), City (default: user's city), Gender (default: user's gender), Hospital/Location (text or map), Quantity (units), request_to (optional), Notes (optional).
  - Button: Post Request.
  - Location Picker: offer map picker and "Use current location for hospital"; persist `locationAddress`, `locationLat`, `locationLng` when available. Request location access only when user opts in; handle denial gracefully.
- Donor Inbox (visible in Donor mode)
  - Tabs: Request To Me (targeted/pending), All Requests (discoverable open requests).
  - Actions: Accept, Reject, View Patient Profile.
  - Logic: Accept on open requests assigns current user as `requestedTo` and sets status `accepted`; reject on targeted requests only by the targeted donor.
  - **Automatic Donation Intent**: When a donor accepts a blood request, a donation record is automatically created with status "pending" to track the commitment. No separate action needed.
- Request History
  - Tabs: All, Pending, Rejected, Accepted, Fulfilled, Cancelled.
  - Patient view: requests I posted by status; link to donor profiles and donation history (accepted donors).
  - Donor view: blood donations I committed to and accepted requests where I am `requestedTo`.
- Request Detail
  - Full request data and comments thread (name, timestamp, message). Actions based on role and status.
  - **No Manual Donation Recording**: Donation records are automatically created when donors accept requests; no separate recording action needed.
- Donor Profile (public)
  - Public profile view with donation stats and availability indicator.
 - Profile (My Account)
  - Sections: My Profile, Settings.
  - **Scrollable Layout**: Must be scrollable when content overflows to ensure all content is accessible.
  - Actions: Availability toggle (mirrors header), Mode switch (Donor/Patient), Theme (System/Light/Dark) with local persistence, Logout.
  - Logout: sign out of auth, clear local caches/session, reset navigation to `/auth/login` (confirm dialog optional).
- Money Donations Tab (Stripe Integration)
  - **Purpose**: General monetary donations to support the blood bank platform and its operations, not direct person-to-person transfers.
  - **Donate Amount Screen**:
    - Amount input with predefined options (500, 1000, 2500, 5000 PKR) and custom amount field
    - Purpose selection (optional): Platform Support, Emergency Fund, Equipment, General
    - Stripe payment processing with secure checkout
    - Confirmation screen with receipt details
  - **Donation History Screen**:
    - List of all user's money donations with date, amount, purpose, and status
    - Each donation links to Stripe receipt for download/printing
    - Filter by date range and amount
    - Total donation statistics and impact summary
- Not Found
  - Friendly fallback for unknown routes.


#### Forms & Validation
- Request Blood required fields: Patient Name, Required Blood Group, City.
- Allowed Blood Groups: A+, A-, B+, B-, O+, O-, AB+, AB-.
- Allowed Genders: Male, Female, Other.
- Phone: must start with +92 and pass Pakistan validation.
- Quantity: positive integer (blood units). Trim all text inputs; reject whitespace-only values.

#### Data Model (Firebase RTDB)
- `users/{uid}` → UserProfile
  - { uid, name, email?, gender?, bloodGroup?, city?, phone?, cnic?, available?, mode?: 'donor'|'patient', themePreference?: 'system'|'light'|'dark', createdAt, updatedAt }
- `requests/{id}` → BloodRequest
  - { id, createdBy, patientName, requiredBloodGroup, city, gender?, hospital?, locationAddress?, locationLat?, locationLng?, unitsRequired?, neededBy?, notes?, requestedTo?, status, createdAt }
- `donations/{uid}/{id}` → Donation
  - { id, requestId, status, date }
- `comments/{requestId}/{id}` → Comment
  - { id, uid, text, createdAt }
- `money_donations/{uid}/{id}` → MoneyDonation (Stripe integration)
  - { id, uid, amount, currency, purpose?, createdAt, receiptUrl?, stripePaymentId?, stripeSessionId? }

#### Client API Contract & Guardrails (implementation guide)
- All data access via `lib/*`. No direct Firebase in UI.
- Auth required for any write. Use ms epoch timestamps. Omit `undefined` fields.
- Naming: mutations `verbNoun`; queries `getX`/`listX`.
- Pagination: optional `limit` and `cursor` (keyset by RTDB key). Client filters allowed initially.

- Users (`lib/users`)
  - `saveUserProfile(partial)`: upsert current user; set `createdAt` on first write; always update `updatedAt`.
  - `getUserProfile(uid?)`: fetch by uid, default current; returns profile or null.
  - `listAvailableDonors(filters?, options?)`: filter by city, bloodGroup, gender, available (default true); returns items and next cursor.
  - `listAllUsers()`: dev/admin utility.
  - `setAvailability(available)`: fast toggle from header/profile; updates `available` and `updatedAt`.

- Requests (`lib/requests`)
  - `postRequest(input)`: targeted → status `pending`; general → `open`; returns request id.
  - `getRequestById(id)`: fetch one request.
  - `listMyRequests(uid?)`: requests created by user.
  - `listRequests(filters?, options?)`: browse with filters: status, city, requiredBloodGroup, createdBy, requestedTo, mineOnly, toMeOnly, openOnly.
  - `listDonorInbox(options?)`: targeted-to-me (`pending`) + discoverable `open` requests.
  - `acceptRequest(id)`: donor accepts; un-targeted requests assign current user; automatically creates donation record.
  - `rejectRequest(id)`: donor rejects; only targeted donor may reject targeted.
  - `cancelRequest(id)`: creator cancels; status `cancelled`.
  - `markFulfilled(id)`: creator marks fulfilled; status `fulfilled`.
  - `getDonorStats(uid)`: totals for received/accepted/rejected.

- Donations (`lib/donations`)
  - `createDonationRecord(requestId, donorUid)`: automatically called when donor accepts a request; creates pending blood donation record; returns id.
  - `updateDonationStatus(donationId, status)`: update donation status (pending → completed/cancelled).
  - `listMyDonations(uid?)`: list blood donation records for user.
  - `createStripePaymentIntent({ amount, currency?, purpose? })`: call Node.js backend to create Stripe payment intent for money donation; returns client secret.
  - `confirmStripePayment({ paymentIntentId, paymentMethodId })`: confirm payment with Stripe using payment method.
  - `recordMoneyDonation({ amount, currency?, purpose?, stripePaymentId, receiptUrl? })`: record completed money donation after Stripe confirmation; returns id.
  - `listMyMoneyDonations(uid?)`: list money donations for user with filtering options (client-side only).

- Comments (`lib/comments`)
  - `addComment(requestId, uid, text)`: add a comment.
  - `listComments(requestId)`: list comments.
  - `deleteComment(requestId, commentId)`: author (or request creator) deletes.


#### Error Categories (UI-facing)
- auth/not-authenticated: sign-in required.
- auth/forbidden: lacks permission.
- input/invalid: validation failed; include field hint.
- data/not-found: record missing.
- net/unavailable: offline/network; show retry.

#### Security (rules intent summary)
- `users/{uid}`: owner read/write.
- `requests/{id}`: authenticated read; create only by creator; creator updates own; targeted donor accepts/rejects; donors may accept open requests (becoming `requestedTo`).
- `donations/{uid}` and `money_donations/{uid}`: owner read/write.
- `comments/{requestId}/{commentId}`: author can write/delete; all signed-in can read.

#### Payment Configuration (Stripe)
- All payments (money donations) are processed through Stripe using Node.js backend for security.
- Client-side configuration: `config/stripe.ts` with environment variables:
  - `EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Stripe publishable key for client-side integration
- Server-side configuration (Node.js backend environment):
  - `STRIPE_SECRET_KEY`: Stripe secret key for server-side operations (secure)
  - `STRIPE_WEBHOOK_SECRET`: Webhook endpoint secret for payment confirmations
  - `FIREBASE_SERVICE_ACCOUNT`: Firebase service account key for database operations
- Payment flows:
  - Money donations: one-time payments to support platform operations (not direct person-to-person transfers) with receipt generation
- Node.js backend endpoints:
  - `POST /api/create-payment-intent`: Create Stripe payment intents for money donations
  - `POST /api/webhook`: Process Stripe webhook events for payment confirmations
- Receipt handling: Store Stripe receipt URLs in `money_donations` records
- Security: Never expose secret keys to client; all sensitive operations handled via Node.js backend

#### Node.js Backend Setup (Stripe Only)
- **Framework**: Express.js with TypeScript
- **Purpose**: Handle Stripe payment processing and webhooks only
- **Payment Processing**: Stripe SDK for payment intents and webhooks
- **Database**: Firebase Admin SDK for storing donation records after successful payments
- **Deployment**: Heroku, Railway, or similar cloud platform
- **Environment Variables**:
  - `STRIPE_SECRET_KEY`: Stripe secret key
  - `STRIPE_WEBHOOK_SECRET`: Webhook endpoint secret
  - `FIREBASE_SERVICE_ACCOUNT`: Firebase service account JSON
  - `PORT`: Server port (default: 3000)
- **API Endpoints**:
  - `POST /api/create-payment-intent`: Create Stripe payment intent
  - `POST /api/webhook`: Stripe webhook handler
  - `GET /api/health`: Health check endpoint

#### Theming & Branding

##### Theme System
- **System Theme Respect**: App automatically follows device light/dark theme by default
- **Manual Override**: In-app theme toggle in Profile settings (System/Light/Dark)
- **Theme Persistence**: User preference stored locally; fallback to system if unset
- **Theme Application**: Consistent theming across all screens, components, and navigation

##### Light Theme Specifications
- **Background Colors**: 
  - Primary background: #FFFFFF (pure white)
  - Secondary background: #F8F9FA (light gray)
  - Card backgrounds: #FFFFFF with subtle shadows
  - Input backgrounds: #F1F3F4
- **Text Colors**:
  - Primary text: #000000 (pure black)
  - Secondary text: #6C757D (medium gray)
  - Disabled text: #ADB5BD (light gray)
  - Link text: #007BFF (blue)
- **UI Elements**:
  - Borders: #E9ECEF (light gray)
  - Shadows: rgba(0,0,0,0.1)
  - Status bar: dark content on light background

##### Dark Theme Specifications
- **Background Colors**:
  - Primary background: #000000 (pure black)
  - Secondary background: #1A1A1A (dark gray)
  - Card backgrounds: #2D2D2D with subtle highlights
  - Input backgrounds: #3A3A3A
- **Text Colors**:
  - Primary text: #FFFFFF (pure white)
  - Secondary text: #B0B0B0 (light gray)
  - Disabled text: #666666 (medium gray)
  - Link text: #4A9EFF (lighter blue)
- **UI Elements**:
  - Borders: #404040 (medium gray)
  - Shadows: rgba(255,255,255,0.1)
  - Status bar: light content on dark background

##### Theme Switching Behavior
- **Immediate Application**: Theme changes apply instantly without app restart
- **Complete App Theme**: Theme changes affect the entire app, not just navigation elements
- **Component Updates**: All screens, modals, and components update simultaneously
- **Navigation Theme**: Tab bar, headers, and navigation elements update accordingly
- **Status Bar**: Automatically adjusts content color based on theme
- **Splash Screen**: Matches selected theme on app launch
- **Global Theme**: Background colors, text colors, and UI elements update throughout the entire application

##### Branding Elements
- Header shows `assets/images/logo.jpg` (with theme-appropriate variants if needed)
- App icon and favicon configured via `app.json`
- Logo visibility optimized for both light and dark backgrounds

#### Performance & Scalability
- Batch reads; debounce searches; avoid heavy listeners on tab roots.
- Plan fan-out indexes if lists grow:
  - `user_requests/{uid}/{requestId}: true`
  - `donor_requests/{uid}/{requestId}: true`
  - `open_requests/{requestId}: true`

#### Accessibility & UX
- High contrast, large touch targets, clear CTAs.
- **Scrollable Content**: All screens must support scrolling when content overflows to ensure accessibility on all device sizes.
- Announce status changes (accept/reject/fulfilled) where possible.

#### Telemetry (optional)
- Log key events (post request, accept/reject, fulfilled, money donated) without PII.

#### Seeder (dev)
- Purpose: populate a realistic dataset so flows can be tested end-to-end (Donor discovery, targeted/general requests, inbox actions, money donations).
- Behavior: destructive refresh. Deletes existing data under RTDB roots used by the app, then inserts the seed dataset only.
- How to run: `tsx scripts/seed.ts` (requires dev Firebase config). Optionally run with `SEED_EMAIL`/`SEED_PASSWORD` for authenticated writes; rules should allow seeding in dev.

- Dataset shape:
  - users/{uid}
    - 1 Patient (onboarding complete) in Karachi.
    - 6 Donors across Karachi/Lahore/Islamabad with varied genders and blood groups; 4 marked `available=true`, 2 `available=false`.
    - Example fields per user: { uid, name, email, gender, bloodGroup, city, phone, cnic?, available, createdAt, updatedAt }
  - requests/{id}
    - 1 open general request (city matches Patient), 1 targeted pending to an available donor, 1 accepted assigned to another donor.
    - Fields: { id, createdBy, patientName, requiredBloodGroup, city, gender?, hospital?, locationAddress?, locationLat?, locationLng?, unitsRequired?, neededBy?, notes?, requestedTo?, status, createdAt }
  - comments/{requestId}/{id}
    - 2–3 comments on the pending/accepted requests for UI testing.
    - Fields: { id, uid, text, createdAt }
  - donations/{uid}/{id}
    - For donors who accepted: create 1 blood donation intent with status "pending" or a past fulfilled record if needed for history.
    - Fields: { id, requestId, status, date }
  - money_donations/{uid}/{id}
    - Add 3–5 money donations across 2 users with varied amounts (e.g., 500, 1000, 2500 PKR) and optional purposes.
    - Fields: { id, uid, amount, currency: 'PKR', purpose?, createdAt, receiptUrl?, stripePaymentId?, stripeSessionId? }

- Index helpers (optional for scale testing):
  - user_requests/{uid}/{requestId}: true
  - donor_requests/{uid}/{requestId}: true
  - open_requests/{requestId}: true


#### Best Practices
- Only `lib/*` modules access Firebase; screens import these modules, not SDKs.
- Keep functions single-purpose (e.g., `acceptRequest` only changes assignee/status).
- Store ms epoch; convert to `Date` in UI only.
- Use optimistic UI where safe (availability toggle, comment post) and reconcile on settle.
- Plan for scalability with fan-out:
  - `user_requests/{uid}/{requestId}: true`
  - `donor_requests/{uid}/{requestId}: true`
  - `open_requests/{requestId}: true`
- Performance: batch reads, debounce search, avoid heavy listeners on tab roots.
- Accessibility: high contrast, large touch targets, announce status changes.
- Telemetry (optional): log key events (post, accept, reject, fulfill, money donate) without PII.
- Environment: document Firebase config and any env overrides in README; do not commit secrets.