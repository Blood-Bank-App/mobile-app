import { initializeApp, FirebaseApp, FirebaseOptions } from 'firebase/app';
import { getDatabase, Database } from 'firebase/database';
import { initializeAuth, getReactNativePersistence, Auth } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig: FirebaseOptions = {
  apiKey: "AIzaSyDBKr5eE4TV-uget7xQsUko5UxzXJ1M66Y",
  authDomain: "bloodbank-50357.firebaseapp.com",
  projectId: "bloodbank-50357",
  storageBucket: "bloodbank-50357.firebasestorage.app",
  messagingSenderId: "573555262048",
  appId: "1:573555262048:web:a8c4b8231c3c52c17e7905",
  measurementId: "G-4NYETVY0NJ"
};


// 🔥 Initialize Firebase
const app: FirebaseApp = initializeApp(firebaseConfig);

// ✅ Fix: initialize auth with persistence for React Native
const auth: Auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// 🔄 Realtime DB
const database: Database = getDatabase(app);

export { app, auth, database };