import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import Constants from 'expo-constants';

let app: FirebaseApp | undefined;

export function getFirebaseApp(): FirebaseApp {
  if (!app) {
    const cfg = (Constants.expoConfig?.extra as any)?.firebase;
    if (!cfg) {
      throw new Error('Firebase config missing in app.json extra.firebase');
    }
    app = getApps().length ? getApps()[0]! : initializeApp(cfg);
  }
  return app!;
}

export const auth = getAuth(getFirebaseApp());
export const db = getDatabase(getFirebaseApp());

