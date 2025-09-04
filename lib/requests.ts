import { auth, database } from '@/database/firebase';
import { get, push, ref, set } from 'firebase/database';
import { BloodRequest } from './types';

export async function postRequest(payload: Omit<BloodRequest, 'id' | 'status' | 'createdAt' | 'createdBy'>): Promise<string> {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error('Not authenticated');
  const id = push(ref(database, 'requests')).key!;
  const data: BloodRequest = {
    id,
    createdBy: uid,
    status: 'open',
    createdAt: Date.now(),
    patientName: payload.patientName,
    requiredBloodGroup: payload.requiredBloodGroup,
    city: payload.city,
    gender: payload.gender,
    hospital: payload.hospital,
    unitsRequired: payload.unitsRequired,
    neededBy: payload.neededBy,
    notes: payload.notes,
  };
  await set(ref(database, `requests/${id}`), data);
  return id;
}

export async function listMyRequests(uid?: string): Promise<BloodRequest[]> {
  const userId = uid ?? auth.currentUser?.uid;
  if (!userId) return [];
  const snap = await get(ref(database, 'requests'));
  if (!snap.exists()) return [];
  const all: BloodRequest[] = Object.values(snap.val());
  return all.filter((r) => r.createdBy === userId);
}

export async function getRequestById(id: string): Promise<BloodRequest | null> {
  const snap = await get(ref(database, `requests/${id}`));
  if (!snap.exists()) return null;
  return snap.val() as BloodRequest;
}


