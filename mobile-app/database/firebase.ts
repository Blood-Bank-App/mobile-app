import { FirebaseApp, FirebaseOptions, initializeApp } from 'firebase/app';
import { Auth, initializeAuth } from 'firebase/auth';
import { Database, getDatabase } from 'firebase/database';

export const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_APIKEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  databaseURL: process.env.EXPO_PUBLIC_FIREBASE_DATABASE_URL,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
};


// 🔥 Initialize Firebase
const app: FirebaseApp = initializeApp(firebaseConfig);

// ✅ Fix: initialize auth with persistence for React Native
// const auth: Auth = initializeAuth(app, {
//   persistence: getReactNativePersistence(AsyncStorage),
// });

const auth: Auth = initializeAuth(app);
// 🔄 Realtime DB
const database: Database = getDatabase(app);

export { app, auth, database };

