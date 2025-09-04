import { FirebaseApp, FirebaseOptions, initializeApp } from 'firebase/app';
import { Auth, initializeAuth } from 'firebase/auth';
import { Database, getDatabase } from 'firebase/database';

export const firebaseConfig: FirebaseOptions = {
  apiKey: "AIzaSyDBKr5eE4TV-uget7xQsUko5UxzXJ1M66Y",
  authDomain: "bloodbank-50357.firebaseapp.com",
  projectId: "bloodbank-50357",
  databaseURL: "https://bloodbank-50357-default-rtdb.firebaseio.com",
  storageBucket: "bloodbank-50357.firebasestorage.app",
  messagingSenderId: "573555262048",
  appId: "1:573555262048:web:a8c4b8231c3c52c17e7905",
  measurementId: "G-4NYETVY0NJ"
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

