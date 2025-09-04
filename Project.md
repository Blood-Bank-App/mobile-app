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
-Inputs:
    -Phone (input type=tel, with +92 auto-prefix).
        -"Send OTP" button
-Buttons:
    -"Continue with Phone" (red, full width)
    -"Login with Email" (secondary option)


### Login
-Inputs:
    -Phone (input, type=tel)
         -"Send OTP" button
-Buttons:
    -"Continue with Phone" (red, full width)
    -"Login with Email" (secondary option)


### OTP Verification
-Inputs:
    -6-digit OTP code (input).
-Buttons:
    -"Verify OTP".
    -"Resend OTP" (secondary).


### Complete Profile (after OTP success signup)
-Inputs:
-Full Name (text input).
    -Email (input, optional).
    -Gender (dropdown).
    -Blood Group (dropdown).
    -City (dropdown with Pakistani cities).
    -CNIC (optional, for verification).

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


### Request Blood Screen
-Inputs:
    -Patient Name (input) (by default showing that loggedin user name)
    -Required Blood Group (dropdown) (by default showing that loggedin user group)
    -City (dropdown)  (by default showing that loggedin user city)
    -Gender (dropdown)  (by default showing that loggedin user gender)
    -Hospital/Location (input)
    -Units Required (number input)
    -Needed By (date/time picker)
    -Additional Notes (textarea)

-Buttons:
    -"Post Request" (red, full width)


### Donor List Screen
-Filters:
    -Blood Group (multi-select dropdown)
    -City
    -Availability (only show active donors)
    -Cards (per donor):
    -Profile image, name, blood group, city, gender
    -"Contact" button (call/sms/WhatsApp integration)


### Request Detail Screen
-Shows one blood request in detail.
-Info: patient name, blood group, hospital, units, notes, requester contact.

-Buttons:
    -"I Can Donate" (red, full width)
    -"Share Request" (WhatsApp/Facebook/Twitter)


### Donation History
    -Shows donations made and requests created.
    -Fields: Date, Patient, Hospital, Status (Donated / Pending).


### Comments/Support on Requests
-Each request has a comment section:
-Input: "Write a comment…" (text field)
-Button: "Post" (send icon)
-Display: threaded comments (name, timestamp, message).