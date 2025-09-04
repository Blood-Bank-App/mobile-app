### Blood Donation App – Full Plan (React Native Expo & Firebase)
### Core Goals

-Save lives → fast donor matching (by city, blood group, availability).
-Trust & Safety → verified donors, hospitals, NGOs.
-Sustainability → optional paid features (priority requests, hospital/NGO subscriptions).


### User Roles
-Donor → register, mark availability, donate.
-Receiver (Family/Patient) → create requests, contact donors.
-Hospital/NGO → manage donation drives, verify requests.
-Admin → monitor reports, fraud prevention.


### Screens & Fields


### Signup
-use auth layout. show logo in top center with name "Blood Donation App"
-Inputs:
    -Email
    -Password
-Buttons:
    -"Login" (secondary option)
    -onsuccess reset form and send to onboarding
-Link
    -already have an account

### Onboarding Profile (after signup login)
-use auth layout. show logo in top center with name "Blood Donation App"
-Inputs:
    -Full Name (text input).
    -Email (input, optional).
    -Gender (dropdown).
    -Phone number (must start with +92 and pakistan validate).
    -Blood Group (dropdown).
    -Available as donar (toggle).
    -City (dropdown with Pakistani cities).
    -CNIC (optional, for verification).

-Buttons:
    -"Save & Continue" (red, full width).
-onsuccess reset form and send to dashboard

### Login
-use auth layout. show logo in top center with name "Blood Donation App"
-if user didn't complete onboading then after login redirect into onboading where user first complete onboading
-Inputs:
    -Email
    -Password
-Buttons:
    -"Login"
    -Links: "Create account", "Forgot password"
-Notes:
    -Auth guard → tabs require login; logged-out users are redirected to Login

### Reset Password
-use auth layout. show logo in top center with name "Blood Donation App"
-Input:
    -Email
-Button:
    -"Send Reset Email"


### Complete Profile (after first login)
-use auth layout. show logo in top center with name "Blood Donation App"
-show prefilled data
-Inputs:
-Full Name (text input).
    -Email (input, disabled).
    -Gender (dropdown).
    -Phone number (must start with +92 and pakistan validate).
    -Blood Group (dropdown).
    -City (dropdown with Pakistani cities).
    -CNIC (optional, for verification).
    -Available as donar (toggle).
-Buttons:
    -"Save & Continue" (red, full width).

# After signup, the user lands on Home with donor/receiver options.


### Home Screen
-Sections:
    -Search bar → "Search by blood group, city, hospital"
    -Urgent Requests → card with patient name, city, blood group, time left
    -Find Donors → CTA button
    -Hospitals/NGOs → verified partners list

-Buttons:
    -"Request Blood" (red, full width)
    -"Become a Donor"


### Profile Screen

-Layout:
    -Image upload (center, circular avatar)
    -Fields:
        -Name (input, label)
        -Email (input type=email, label)
        -Phone (input, label, read-only if verified)
        -Gender (dropdown: Male/Female/Other)
        -Blood Group (dropdown: A+, A-, B+, B-, O+, O-, AB+, AB-)
        -City (dropdown)
        -Availability Toggle (switch: Available / Not Available)

    -Buttons:
        -"Save Profile" (red, full width)
        -"Logout" (secondary)



### Donor List Screen
-Show list of users who marked as avilable as donar
-patient can request you directly. it reqirect into request-blood-screen with filled requested_to
-Filters:
    -Blood Group (multi-select dropdown)
    -City
    -Availability (only show active donors)
    -Cards (per donor):
    -Profile image, name, blood group, city, gender
    -"Contact" button (call/sms/WhatsApp integration)


### Request History.
-there should be tab. (all, pending, reject, accept)
-patient can view all the request that user made as per status
-user can view profile of donar and their blood-donate history who accpet their request.


### Request Blood Screen
-if we have request_to then create request directly for that user and notify that user via whatsapp or notificaton. it will pending until that requested user not accept.
-if no request_to then user can make it general that other can accept.

-Inputs:
    -Patient Name (input) (defaults to logged-in user's name)
    -Required Blood Group (dropdown) (defaults to logged-in user's group)
    -City (dropdown)  (defaults to logged-in user's city)
    -Gender (dropdown)  (defaults to logged-in user's gender)
    -Hospital/Location (input, ask for location or allow to add current location or location from google map)
    -Quantity (units) (number input)
    -request_to (donor uid, optional)
    -status (open/pending/accepted/rejected/fulfilled/cancelled)
    -Additional Notes (textarea)

-Buttons:
    -"Post Request" (red, full width)


### Patient request
-show tabs
    -request to me
    -all request  (not me)
-it will show all user request for donor. this screen only visible to donor.
-there should be button reject or accept donar request.
-donor can view patient profile as well.
-donor can directly donate amount to that patient as well

### Blood donate history
-how many times user accept/reject patient request. will count as blood donate.
-how many total request recive specific donor

### Amount Donation Add
    -add form for donation. integrate stripe
    -Fields: donation ammount, purpose

### Amount Donation History
    -show history of donation and allow to view recipt. fetch directly from stripe and allow to download


### Comments/Support on Requests
-Each request has a comment section:
-Input: "Write a comment…" (text field)
-Button: "Post" (send icon)
-Display: threaded comments (name, timestamp, message).


### Dasbord  Layout
-show screen name on top. with red background and white color. 
-show enough height. it shouldn't height behind.

### Navigation Structure (expo-router)
- Auth stack: `/auth/login`, `/auth/signup`, `/auth/reset`, `/auth/onboarding`
- Tabs: `/(tabs)/home`, `/(tabs)/donors`, `/(tabs)/request`, `/(tabs)/history`, `/(tabs)/profile`
- Request list/history: `/request`
- Request detail: `/request/[id]`
- Money donations: `/donations`, `/donations/add`
- Not found: `/+not-found`

Auth Guard: tabs require authentication; logged-out users are redirected to `/auth/login`.


### Theming & Branding
- System light/dark theme respected (navigation theme)
- App header shows logo from `assets/images/logo.jpg`
- App icon and web favicon configured in `app.json` (`assets/images/icon.png`, `assets/images/favicon.png`)


### Forms & Validation
- Request Blood: required → Patient Name, Blood Group, City
- Dropdowns powered by predefined lists:
  - Blood Groups: `A+, A-, B+, B-, O+, O-, AB+, AB-`
  - Genders: `Male, Female, Other`
  - Cities: major Pakistan cities list
- Quantity label used for blood units
- Request form pre-fills defaults from user profile (name, blood group, city, gender)


### Profile
- Fields: name, email (optional), gender, blood group, city, availability toggle
- Actions: Save Profile, Logout


### Data Model (Firebase Realtime Database)
- `users/{uid}` → UserProfile
  - { uid, name, email?, gender?, bloodGroup?, city?, phone?, cnic?, available?, createdAt, updatedAt }
- `requests/{id}` → BloodRequest
  - { id, createdBy, patientName, requiredBloodGroup, city, gender?, hospital?, unitsRequired?, neededBy?, notes?, status, createdAt }
- `donations/{uid}/{id}` → Donation
  - { id, requestId, status, date }
- `comments/{requestId}/{id}` → Comment
  - { id, uid, text, createdAt }


### Seeder (test data)
- Script: `scripts/seed.ts` seeds sample users and an open request
- Intended usage (dev):
  - Install a TS runner: `npm i -D tsx`
  - Client seeding (no service account): set environment variables `SEED_EMAIL` and `SEED_PASSWORD` to a Firebase user with write access; ensure DB rules allow writes for authenticated users
  - Optionally set Firebase config via env vars (see script header) if different
  - Run: `SEED_EMAIL=you@example.com SEED_PASSWORD=yourPass npx tsx scripts/seed.ts`


### Future Enhancements
- Current location / Google Maps picker for Hospital/Location
- Theme toggle switch in-app (manual override of system theme)
- Donor contact actions (Call/SMS/WhatsApp)
- Donor list filters: multi-select blood groups, city, availability