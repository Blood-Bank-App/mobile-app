// Client-side seeder using Firebase Web SDK (no service account).
// Requires a Firebase user with write permissions and permissive DB rules for that user.
import { initializeApp } from 'firebase/app';
import { createUserWithEmailAndPassword, getAuth, inMemoryPersistence, setPersistence, signInWithEmailAndPassword } from 'firebase/auth';
import { getDatabase, push, ref, set } from 'firebase/database';

// Configure from env if provided, otherwise fall back to project defaults.
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || 'AIzaSyDBKr5eE4TV-uget7xQsUko5UxzXJ1M66Y',
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || 'bloodbank-50357.firebaseapp.com',
  projectId: process.env.FIREBASE_PROJECT_ID || 'bloodbank-50357',
  databaseURL:
    process.env.FIREBASE_DATABASE_URL || 'https://bloodbank-50357-default-rtdb.firebaseio.com',
  storageBucket:
    process.env.FIREBASE_STORAGE_BUCKET || 'bloodbank-50357.firebasestorage.app',
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || '573555262048',
  appId: process.env.FIREBASE_APP_ID || '1:573555262048:web:a8c4b8231c3c52c17e7905',
};

const SEED_EMAIL = process.env.SEED_EMAIL || 'donar@gmail.com';
const SEED_PASSWORD = process.env.SEED_PASSWORD || '123456';

async function main() {
  if (!SEED_EMAIL || !SEED_PASSWORD) {
    throw new Error('Missing SEED_EMAIL/SEED_PASSWORD env vars for client seeding.');
  }

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const database = getDatabase(app);
  await setPersistence(auth, inMemoryPersistence);
  try {
    await signInWithEmailAndPassword(auth, SEED_EMAIL, SEED_PASSWORD);
  } catch (e: any) {
    // If user doesn't exist yet, create it; if wrong password, create a throwaway temp account
    const code = e?.code ?? '';
    if (code === 'auth/user-not-found') {
      await createUserWithEmailAndPassword(auth, SEED_EMAIL, SEED_PASSWORD);
    } else if (code === 'auth/invalid-credential' || code === 'auth/wrong-password') {
      const tmpEmail = `seed_${Date.now()}@example.com`;
      await createUserWithEmailAndPassword(auth, tmpEmail, SEED_PASSWORD);
      console.log(`Created temporary seed user: ${tmpEmail}`);
    } else if (code === 'auth/operation-not-allowed') {
      throw new Error('Enable Email/Password provider in Firebase Authentication settings.');
    } else {
      throw e;
    }
  }

  const now = Date.now();
  const users = [
    { uid: 'u1', name: 'Ali Khan', bloodGroup: 'O+', city: 'Lahore', gender: 'Male', available: true },
    { uid: 'u2', name: 'Sara Ahmed', bloodGroup: 'A-', city: 'Karachi', gender: 'Female', available: true },
    { uid: 'u3', name: 'Bilal', bloodGroup: 'B+', city: 'Islamabad', gender: 'Male', available: false },
  ];
  for (const u of users) {
    await set(ref(database, `users/${u.uid}`), { ...u, createdAt: now, updatedAt: now });
  }

  const reqRef = push(ref(database, 'requests'));
  await set(reqRef, {
    id: reqRef.key!,
    createdBy: 'u1',
    status: 'open',
    createdAt: now,
    patientName: 'Hassan',
    requiredBloodGroup: 'O+',
    city: 'Lahore',
    gender: 'Male',
    hospital: 'Jinnah Hospital',
    unitsRequired: 2,
    notes: 'Urgent',
  });

  console.log('Seeding complete');
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
main().catch((e) => {
  console.error('Seeding failed:', e?.message ?? e);
  process.exit(1);
});


