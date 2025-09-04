import { auth, database } from '@/database/firebase';
import { equalTo, get, orderByChild, query, ref, set } from 'firebase/database';
import { UserProfile } from './types';

export async function saveUserProfile(partial: Partial<UserProfile>): Promise<void> {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error('Not authenticated');
  const now = Date.now();
  const existingSnap = await get(ref(database, `users/${uid}`));
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
    createdAt: (current.createdAt as number) ?? now,
    updatedAt: now,
  };
  await set(ref(database, `users/${uid}`), profile);
}

export async function getUserProfile(uid?: string): Promise<UserProfile | null> {
  const id = uid ?? auth.currentUser?.uid;
  if (!id) return null;
  const snap = await get(ref(database, `users/${id}`));
  if (!snap.exists()) return null;
  return snap.val() as UserProfile;
}

export async function listAvailableDonors(): Promise<UserProfile[]> {
  // Filter by available == true
  const donorsRef = query(ref(database, 'users'), orderByChild('available'), equalTo(true));
  const snap = await get(donorsRef as any);
  if (!snap.exists()) return [];
  const result: UserProfile[] = Object.values(snap.val());
  return result;
}


