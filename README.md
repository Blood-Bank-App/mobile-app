# Blood Bank Mobile App

A React Native mobile application for the Blood Bank system, built with Expo Router and integrated with a Python FastAPI backend.

## Features

- **JWT Authentication**: Secure login/signup with token-based authentication
- **Real-time Updates**: Socket.IO integration for live notifications and updates
- **Blood Request Management**: Create, accept, and track blood donation requests
- **Donor Profiles**: Manage donor availability and profile information
- **Push Notifications**: OneSignal integration for important alerts
- **Payment Integration**: Stripe for money donations
- **AI Chat Support**: Real-time AI assistance for users
- **Dark/Light Theme**: User preference support

## Tech Stack

- **Framework**: React Native with Expo Router
- **Backend**: Python FastAPI with MongoDB
- **Authentication**: JWT tokens
- **Real-time**: Socket.IO WebSocket
- **Notifications**: OneSignal
- **Payments**: Stripe
- **State Management**: React Context
- **Navigation**: Expo Router (file-based routing)

## Prerequisites

- Node.js 18+ and npm/yarn
- Expo CLI (`npm install -g @expo/cli`)
- Python backend running on `http://localhost:8000`
- MongoDB database
- OneSignal account (for push notifications)
- Stripe account (for payments)

## Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Environment Setup**:
   Create a `.env.local` file in the root directory:
   ```env
   # API Configuration
   EXPO_PUBLIC_API_BASE_URL=http://localhost:8000/api
   EXPO_PUBLIC_SOCKET_URL=http://localhost:8000
   
   # App Configuration
   EXPO_PUBLIC_APP_NAME=Blood Bank App
   EXPO_PUBLIC_APP_VERSION=1.0.0
   
   # Development settings
   EXPO_PUBLIC_DEBUG=true
   
   # OneSignal Configuration (for push notifications)
   EXPO_PUBLIC_ONESIGNAL_APP_ID=your-onesignal-app-id
   
   # Stripe Configuration (for payments)
   EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-publishable-key
   ```

3. **Start Development Server**:
   ```bash
   npm start
   ```

4. **Run on Device/Simulator**:
   ```bash
   npm run android  # Android
   npm run ios      # iOS
   npm run web      # Web
   ```

## Project Structure

```
mobile-app/
├── app/                    # Expo Router pages
│   ├── (tabs)/            # Tab navigation screens
│   │   ├── home.tsx       # Home screen
│   │   ├── donors.tsx     # Available donors
│   │   ├── request.tsx    # Blood requests
│   │   ├── donate.tsx     # Donation screen
│   │   ├── history.tsx    # Donation history
│   │   ├── inbox.tsx      # Donor inbox
│   │   └── profile.tsx    # User profile
│   ├── auth/              # Authentication screens
│   │   ├── login.tsx      # Login screen
│   │   ├── signup.tsx     # Signup screen
│   │   ├── reset.tsx      # Password reset
│   │   └── onboarding.tsx # Profile setup
│   └── request/           # Request-specific screens
├── components/            # Reusable components
├── constants/            # App constants (Colors, etc.)
├── context/              # React Context providers
├── data/                 # Static data (cities, blood groups)
├── hooks/                # Custom React hooks
├── lib/                  # Service layer (API calls)
│   ├── users.ts          # User management
│   ├── requests.ts       # Blood request management
│   ├── donations.ts      # Donation management
│   ├── comments.ts       # Comment management
│   └── types.ts          # TypeScript types
├── services/             # External service integrations
│   ├── api.ts            # REST API client
│   └── socket.ts         # Socket.IO client
└── utils/                # Utility functions
```

## API Integration

The mobile app integrates with the Python FastAPI backend:

### Authentication
- **Login**: `POST /api/auth/login`
- **Register**: `POST /api/auth/register`
- **Refresh Token**: `POST /api/auth/refresh`
- **Password Reset**: `POST /api/auth/reset-password`

### User Management
- **Get Profile**: `GET /api/users/profile`
- **Update Profile**: `PUT /api/users/profile`
- **List Donors**: `GET /api/users/donors`
- **Toggle Availability**: `PUT /api/users/availability`

### Blood Requests
- **Create Request**: `POST /api/requests`
- **List Requests**: `GET /api/requests`
- **Accept Request**: `PUT /api/requests/:id/accept`
- **Reject Request**: `PUT /api/requests/:id/reject`
- **Donor Inbox**: `GET /api/requests/inbox`

### Real-time Features
The app uses Socket.IO for real-time updates:
- New blood requests
- Request status updates
- Donor availability changes
- Push notifications
- AI chat responses

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `EXPO_PUBLIC_API_BASE_URL` | Backend API base URL | Yes |
| `EXPO_PUBLIC_SOCKET_URL` | Socket.IO server URL | Yes |
| `EXPO_PUBLIC_ONESIGNAL_APP_ID` | OneSignal app ID for push notifications | Yes |
| `EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key for payments | Yes |
| `EXPO_PUBLIC_APP_NAME` | App display name | No |
| `EXPO_PUBLIC_DEBUG` | Enable debug mode | No |

## Development

### Available Scripts

- `npm start` - Start Expo development server
- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS device/simulator
- `npm run web` - Run in web browser
- `npm run lint` - Run ESLint

### Code Style

- Use TypeScript for type safety
- Follow React Native best practices
- Use Expo Router for navigation
- Implement proper error handling
- Use React Context for state management

## Deployment

### Building for Production

1. **Configure environment variables** for production
2. **Build the app**:
   ```bash
   expo build:android  # Android APK
   expo build:ios      # iOS IPA
   ```

3. **Deploy to app stores**:
   - Google Play Store (Android)
   - Apple App Store (iOS)

### Environment Setup

For production deployment, update these environment variables:
```env
EXPO_PUBLIC_API_BASE_URL=https://your-backend-domain.com/api
EXPO_PUBLIC_SOCKET_URL=https://your-backend-domain.com
EXPO_PUBLIC_ONESIGNAL_APP_ID=your-production-onesignal-id
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your-stripe-key
```

## Troubleshooting

### Common Issues

1. **API Connection Failed**
   - Check if Python backend is running
   - Verify `EXPO_PUBLIC_API_BASE_URL` is correct
   - Check network connectivity

2. **Socket.IO Connection Issues**
   - Verify `EXPO_PUBLIC_SOCKET_URL` is correct
   - Check if WebSocket is enabled on backend
   - Ensure JWT token is valid

3. **Push Notifications Not Working**
   - Verify OneSignal configuration
   - Check device notification permissions
   - Ensure OneSignal app ID is correct

4. **Payment Issues**
   - Verify Stripe configuration
   - Check if using correct keys (test/live)
   - Ensure backend webhook is configured

## Contributing

1. Follow the existing code style
2. Use meaningful commit messages
3. Test your changes thoroughly
4. Update documentation as needed

## License

This project is part of the Blood Bank application suite.
