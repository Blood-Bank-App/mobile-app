import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

var firebaseConfig = {
  apiKey: "AIzaSyDBKr5eE4TV-uget7xQsUko5UxzXJ1M66Y",
  authDomain: "bloodbank-50357.firebaseapp.com",
  projectId: "bloodbank-50357",
  storageBucket: "bloodbank-50357.firebasestorage.app",
  messagingSenderId: "573555262048",
  appId: "1:573555262048:web:a8c4b8231c3c52c17e7905",
  measurementId: "G-4NYETVY0NJ"
};


// 🔥 Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Fix: initialize auth with persistence for React Native
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// 🔄 Realtime DB
const database = getDatabase(app);

export { app, auth, database };