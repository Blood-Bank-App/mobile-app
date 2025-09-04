import { auth, database } from '@/database/firebase';
import { get, push, ref, set } from 'firebase/database';
import { Donation } from './types';

export async function recordDonationIntent(requestId: string): Promise<string> {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error('Not authenticated');
  const id = push(ref(database, `donations/${uid}`)).key!;
  const data: Donation = {
    id,
    requestId,
    status: 'pending',
    date: Date.now(),
  };
  await set(ref(database, `donations/${uid}/${id}`), data);
  return id;
}

export async function listMyDonations(uid?: string): Promise<Donation[]> {
  const userId = uid ?? auth.currentUser?.uid;
  if (!userId) return [];
  const snap = await get(ref(database, `donations/${userId}`));
  if (!snap.exists()) return [];
  return Object.values(snap.val());
}


