import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { db } from '@/lib/firebase';
import { ref, get, set, update } from 'firebase/database';
import { useAuth } from './AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type AppMode = 'donor' | 'patient';

export type UserProfile = {
  uid: string;
  name?: string;
  email?: string;
  gender?: string;
  bloodGroup?: string;
  city?: string;
  phone?: string;
  cnic?: string;
  available?: boolean;
  mode?: AppMode;
  themePreference?: 'system' | 'light' | 'dark';
  createdAt?: number;
  updatedAt?: number;
};

type CtxValue = {
  profile: UserProfile | null;
  loading: boolean;
  mode: AppMode;
  setMode: (m: AppMode) => Promise<void>;
  setAvailability: (available: boolean) => Promise<void>;
  refresh: () => Promise<void>;
};

const STORAGE_MODE_KEY = 'app_mode_v1';

const UserProfileContext = createContext<CtxValue | undefined>(undefined);

export const UserProfileProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [mode, setModeState] = useState<AppMode>('patient');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem(STORAGE_MODE_KEY);
      if (stored === 'donor' || stored === 'patient') setModeState(stored);
    })();
  }, []);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.uid]);

  async function load() {
    if (!user) return;
    setLoading(true);
    const snap = await get(ref(db, `users/${user.uid}`));
    const now = Date.now();
    if (snap.exists()) {
      const data = snap.val() as UserProfile;
      setProfile(data);
      if (data.mode) {
        setModeState(data.mode);
        await AsyncStorage.setItem(STORAGE_MODE_KEY, data.mode);
      }
    } else {
      const payload: UserProfile = {
        uid: user.uid,
        email: user.email || undefined,
        available: false,
        mode: 'patient',
        createdAt: now,
        updatedAt: now
      };
      await set(ref(db, `users/${user.uid}`), payload);
      setProfile(payload);
      setModeState('patient');
      await AsyncStorage.setItem(STORAGE_MODE_KEY, 'patient');
    }
    setLoading(false);
  }

  async function setMode(newMode: AppMode) {
    setModeState(newMode);
    await AsyncStorage.setItem(STORAGE_MODE_KEY, newMode);
    if (user) {
      await update(ref(db, `users/${user.uid}`), { mode: newMode, updatedAt: Date.now() });
      await load();
    }
  }

  async function setAvailability(available: boolean) {
    if (!user) return;
    setProfile((prev) => (prev ? { ...prev, available } : prev));
    await update(ref(db, `users/${user.uid}`), { available, updatedAt: Date.now() });
  }

  const value = useMemo<CtxValue>(() => ({ profile, loading, mode, setMode, setAvailability, refresh: load }), [profile, loading, mode]);

  return <UserProfileContext.Provider value={value}>{children}</UserProfileContext.Provider>;
};

export function useUserProfile() {
  const ctx = useContext(UserProfileContext);
  if (!ctx) throw new Error('useUserProfile must be used within UserProfileProvider');
  return ctx;
}

