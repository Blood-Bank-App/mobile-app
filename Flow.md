### Blood Donation App – Behavior Flow with OpenAI (React Native Expo & Firebase)
### Signup Journey

### Signup
    -User enters phone number → Firebase sends OTP.
    -AI Role: None (basic Firebase).

### Complete Profile
    -User fills name, gender, blood group, city, CNIC (optional).
    -AI Role: Validate weird/invalid inputs (e.g., "Blood group = XYZ" → AI flags).

### Become Donor
    -User toggles availability ON.
    -AI Role: Suggest “best times to donate” based on last donation history.

### Requesting Blood
    -Create Request
    -User posts: patient name, hospital, units, needed by.

### AI Role
    -Auto-check urgency level (e.g., "surgery tomorrow" → mark HIGH priority).
    -Detect fake/suspicious requests (same name reused often, incomplete details, copy-paste text).

### Donor Matching
    -App searches Firestore for same blood group + same city + availability ON.

### AI Role
    -Rank donors → distance, reliability (past history), donation interval.

Suggest Top 5 most likely donors instead of raw list.

### Donor Side
    -Donor Gets Notified
        -Example push: “🚨 Someone near you (2km) needs O+ blood today.”

    -AI Role: Personalize →
        -“Ali, you donated 3 months ago, you’re eligible again.”
        -“This request is urgent and near you.”

### Donor Accepts
    -Taps “I can donate” → matched with receiver.

### Community Support
    -Comments / Chat
        -Donors & families leave comments like:
            -“I’m available at 5pm.”
            -“Which hospital ward?”

### AI Role
-Translate comments (English ↔ Urdu/Punjabi).
-Summarize conversations (“3 people confirmed donation”).

### AI Assistant (FAQ)
-AI FAQ Answering (Chatbot inside app)

-Questions:  
    -“When can I donate again after surgery?”
    -“What if my blood group is rare?”
    -“How safe is blood donation?”
-AI Role: Answer in Urdu/English, short, verified info.

### Logout
-Logout
    -User logs out → session cleared.

### Login Journey
-Login (Phone OTP again)
    -If user is a Donor → taken to Home → Donor Dashboard.
    -If user is a Receiver → taken to Request Blood screen.
    -AI still active in background:
-Suggests matches, flags fake requests, sends smart notifications.


### Summary of OpenAI Roles
-Input Validation – catch invalid names, cities, blood groups.
-Fake Request Detection – AI flags suspicious or duplicate blood requests.
-Donor Ranking – instead of just listing, AI predicts best matches.
-Personalized Notifications – “You’re eligible again” vs. “Someone nearby needs you.”
-Translation – Urdu ↔ English comments & requests.
-FAQ Answering – AI assistant inside app for health + donation queries.
-Conversation Summaries – AI condenses busy comment threads.