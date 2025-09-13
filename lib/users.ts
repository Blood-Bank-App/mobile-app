import { db } from '@/lib/firebase';
import { ref, get, update, set, query, orderByChild, equalTo, limitToFirst, startAfter, push } from 'firebase/database';
import { UserProfile } from '@/lib/types';
import { auth } from '@/lib/firebase';

type ListOptions = { limit?: number; cursor?: string };
type DonorFilters = { city?: string; bloodGroup?: UserProfile['bloodGroup']; gender?: UserProfile['gender']; available?: boolean };

function now() { return Date.now(); }

export async function saveUserProfile(partial: Partial<UserProfile>): Promise<void> {
  const user = auth.currentUser;
  if (!user) throw new Error('auth/not-authenticated');
  const uid = user.uid;
  const r = ref(db, `users/${uid}`);
  const current = await get(r);
  const payload = {
    uid,
    ...partial,
    updatedAt: now(),
    ...(current.exists() ? {} : { createdAt: now() })
  } as UserProfile;
  await set(r, { ...(current.exists() ? current.val() : {}), ...payload });
}

export async function getUserProfile(uid?: string): Promise<UserProfile | null> {
  const id = uid || auth.currentUser?.uid;
  if (!id) throw new Error('auth/not-authenticated');
  const snap = await get(ref(db, `users/${id}`));
  return snap.exists() ? (snap.val() as UserProfile) : null;
}

export async function listAvailableDonors(filters: DonorFilters = {}, options: ListOptions = {}) {
  // Basic filtering client-side due to RTDB limitations without composite indexes
  const snap = await get(ref(db, 'users'));
  const items: UserProfile[] = [];
  if (snap.exists()) {
    const val = snap.val() as Record<string, UserProfile>;
    for (const key of Object.keys(val)) {
      const u = val[key];
      if (filters.available !== false && u.available !== true) continue;
      if (filters.city && u.city !== filters.city) continue;
      if (filters.bloodGroup && u.bloodGroup !== filters.bloodGroup) continue;
      if (filters.gender && u.gender !== filters.gender) continue;
      items.push(u);
    }
  }
  // simple limit
  const limited = options.limit ? items.slice(0, options.limit) : items;
  return { items: limited, nextCursor: undefined as string | undefined };
}

export async function listAllUsers(): Promise<UserProfile[]> {
  const snap = await get(ref(db, 'users'));
  if (!snap.exists()) return [];
  const val = snap.val() as Record<string, UserProfile>;
  return Object.values(val);
}

export async function setAvailability(available: boolean): Promise<void> {
  const user = auth.currentUser;
  if (!user) throw new Error('auth/not-authenticated');
  await update(ref(db, `users/${user.uid}`), { available, updatedAt: now() });
}

import { auth, database } from '@/database/firebase';
import { child, get, ref, update } from 'firebase/database';
import { UserProfile } from './types';

function pathSafeKey(key: string): string {
  return key.replace(/[.#$/\[\]]/g, '_');
}

function stripUndefined<T extends Record<string, unknown>>(obj: T): T {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined)
  ) as T;
}

export async function saveUserProfile(partial: Partial<UserProfile>): Promise<void> {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error('Not authenticated');
  const now = Date.now();
  const key = pathSafeKey(uid);
  const existingSnap = await get(child(ref(database, 'users'), key));
  const current: Partial<UserProfile> = existingSnap.exists() ? (existingSnap.val() as UserProfile) : {};
  const profile: UserProfile = {
    uid,
    name: partial.name ?? current.name ?? '',
    email: partial.email ?? current.email,
    gender: partial.gender ?? current.gender,
    bloodGroup: partial.bloodGroup ?? current.bloodGroup,
    city: partial.city ?? current.city,
    cnic: partial.cnic ?? current.cnic,
    phone: partial.phone ?? current.phone,
    available: partial.available ?? (current.available ?? true),
    mode: partial.mode ?? current.mode ?? 'patient',
    themePreference: partial.themePreference ?? current.themePreference,
    createdAt: (current.createdAt as number) ?? now,
    updatedAt: now,
  };
  // Remove undefined values; update() rejects objects containing undefined
  const cleaned = stripUndefined(profile) as unknown as Record<string, unknown>;
  await update(ref(database), { [`users/${key}`]: cleaned });
}

export async function getUserProfile(uid?: string): Promise<UserProfile | null> {
  const id = uid ?? auth.currentUser?.uid;
  if (!id) return null;
  const key = pathSafeKey(id);
  const snap = await get(child(ref(database, 'users'), key));
  if (!snap.exists()) return null;
  return snap.val() as UserProfile;
}

export async function listAvailableDonors(): Promise<UserProfile[]> {
  // Prefer a simple fetch + filter to be resilient to legacy data types (e.g., 'true' strings)
  const snap = await get(ref(database, 'users'));
  if (!snap.exists()) return [];
  const all = Object.values(snap.val() as Record<string, UserProfile | undefined>)
    .filter(Boolean) as UserProfile[];
  return all.filter((u) => (u as any)?.available === true || (u as any)?.available === 'true');
}


export async function listAllUsers(): Promise<UserProfile[]> {
  const snap = await get(ref(database, 'users'));
  if (!snap.exists()) return [];
  const all = Object.values(snap.val() as Record<string, UserProfile | undefined>)
    .filter(Boolean) as UserProfile[];
  return all;
}

export async function setAvailability(available: boolean): Promise<void> {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error('Not authenticated');
  const key = pathSafeKey(uid);
  const now = Date.now();
  await update(ref(database), {
    [`users/${key}/available`]: available,
    [`users/${key}/updatedAt`]: now,
  });
}


