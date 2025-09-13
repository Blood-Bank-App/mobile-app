import { db, auth } from '@/lib/firebase';
import { ref, get, set, update } from 'firebase/database';
import { BloodRequest, BloodRequestStatus } from '@/lib/types';

function now() { return Date.now(); }
function newId() { return Math.random().toString(36).slice(2); }

type ListFilters = {
  status?: BloodRequestStatus;
  city?: string;
  requiredBloodGroup?: BloodRequest['requiredBloodGroup'];
  createdBy?: string;
  requestedTo?: string;
  mineOnly?: boolean;
  toMeOnly?: boolean;
  openOnly?: boolean;
};

type ListOptions = { limit?: number };

export async function postRequest(input: Omit<BloodRequest, 'id'|'createdBy'|'status'|'createdAt'> & { requestedTo?: string }) {
  const user = auth.currentUser;
  if (!user) throw new Error('auth/not-authenticated');
  const id = newId();
  const status: BloodRequestStatus = input.requestedTo ? 'pending' : 'open';
  const payload: BloodRequest = {
    id,
    createdBy: user.uid,
    patientName: input.patientName,
    requiredBloodGroup: input.requiredBloodGroup,
    city: input.city,
    gender: input.gender,
    hospital: input.hospital,
    locationAddress: input.locationAddress,
    locationLat: input.locationLat,
    locationLng: input.locationLng,
    unitsRequired: input.unitsRequired,
    neededBy: input.neededBy,
    notes: input.notes,
    requestedTo: input.requestedTo,
    status,
    createdAt: now()
  };
  await set(ref(db, `requests/${id}`), payload);
  return id;
}

export async function getRequestById(id: string): Promise<BloodRequest | null> {
  const snap = await get(ref(db, `requests/${id}`));
  return snap.exists() ? (snap.val() as BloodRequest) : null;
}

export async function listMyRequests(uid?: string) {
  const user = auth.currentUser;
  const who = uid || user?.uid;
  if (!who) throw new Error('auth/not-authenticated');
  const snap = await get(ref(db, 'requests'));
  if (!snap.exists()) return [];
  const all = Object.values(snap.val() as Record<string, BloodRequest>);
  return all.filter((r) => r.createdBy === who);
}

export async function listRequests(filters: ListFilters = {}, options: ListOptions = {}) {
  const user = auth.currentUser;
  const snap = await get(ref(db, 'requests'));
  const items: BloodRequest[] = [];
  if (snap.exists()) {
    const val = snap.val() as Record<string, BloodRequest>;
    for (const key of Object.keys(val)) {
      const r = val[key];
      if (filters.status && r.status !== filters.status) continue;
      if (filters.city && r.city !== filters.city) continue;
      if (filters.requiredBloodGroup && r.requiredBloodGroup !== filters.requiredBloodGroup) continue;
      if (filters.createdBy && r.createdBy !== filters.createdBy) continue;
      if (filters.requestedTo && r.requestedTo !== filters.requestedTo) continue;
      if (filters.mineOnly && user && r.createdBy !== user.uid) continue;
      if (filters.toMeOnly && user && r.requestedTo !== user.uid) continue;
      if (filters.openOnly && r.status !== 'open') continue;
      items.push(r);
    }
  }
  return { items: options.limit ? items.slice(0, options.limit) : items, nextCursor: undefined as string | undefined };
}

async function createDonationRecord(requestId: string, donorUid: string) {
  const donationId = newId();
  await set(ref(db, `donations/${donorUid}/${donationId}`), { id: donationId, requestId, status: 'pending', date: now() });
  return donationId;
}

export async function acceptRequest(id: string) {
  const user = auth.currentUser;
  if (!user) throw new Error('auth/not-authenticated');
  const rRef = ref(db, `requests/${id}`);
  const snap = await get(rRef);
  if (!snap.exists()) throw new Error('data/not-found');
  const data = snap.val() as BloodRequest;
  if (data.status === 'open') {
    await update(rRef, { status: 'accepted', requestedTo: user.uid });
  } else if (data.status === 'pending' && data.requestedTo === user.uid) {
    await update(rRef, { status: 'accepted' });
  } else {
    throw new Error('auth/forbidden');
  }
  await createDonationRecord(id, user.uid);
}

export async function rejectRequest(id: string) {
  const user = auth.currentUser;
  if (!user) throw new Error('auth/not-authenticated');
  const rRef = ref(db, `requests/${id}`);
  const snap = await get(rRef);
  if (!snap.exists()) throw new Error('data/not-found');
  const data = snap.val() as BloodRequest;
  if (data.status === 'pending' && data.requestedTo === user.uid) {
    await update(rRef, { status: 'rejected' });
  } else {
    throw new Error('auth/forbidden');
  }
}

export async function cancelRequest(id: string) {
  const user = auth.currentUser;
  if (!user) throw new Error('auth/not-authenticated');
  const rRef = ref(db, `requests/${id}`);
  const snap = await get(rRef);
  if (!snap.exists()) throw new Error('data/not-found');
  const data = snap.val() as BloodRequest;
  if (data.createdBy !== user.uid) throw new Error('auth/forbidden');
  await update(rRef, { status: 'cancelled' });
}

export async function markFulfilled(id: string) {
  const user = auth.currentUser;
  if (!user) throw new Error('auth/not-authenticated');
  const rRef = ref(db, `requests/${id}`);
  const snap = await get(rRef);
  if (!snap.exists()) throw new Error('data/not-found');
  const data = snap.val() as BloodRequest;
  if (data.createdBy !== user.uid) throw new Error('auth/forbidden');
  await update(rRef, { status: 'fulfilled' });
}

export async function getDonorStats(uid: string) {
  const snap = await get(ref(db, 'requests'));
  let received = 0, accepted = 0, rejected = 0;
  if (snap.exists()) {
    const all = Object.values(snap.val() as Record<string, BloodRequest>);
    for (const r of all) {
      if (r.requestedTo === uid) {
        received += 1;
        if (r.status === 'accepted') accepted += 1;
        if (r.status === 'rejected') rejected += 1;
      }
    }
  }
  return { received, accepted, rejected };
}

export async function listDonorInbox(options: ListOptions = {}) {
  const user = auth.currentUser;
  if (!user) throw new Error('auth/not-authenticated');
  const snap = await get(ref(db, 'requests'));
  const items: BloodRequest[] = [];
  if (snap.exists()) {
    const all = Object.values(snap.val() as Record<string, BloodRequest>);
    for (const r of all) {
      if ((r.status === 'pending' && r.requestedTo === user.uid) || r.status === 'open') items.push(r);
    }
  }
  return { items: options.limit ? items.slice(0, options.limit) : items, nextCursor: undefined as string | undefined };
}

import { auth, database } from '@/database/firebase';
import { get, push, query, ref, set } from 'firebase/database';
import { BloodRequest, Donation } from './types';

function stripUndefined<T extends Record<string, unknown>>(obj: T): T {
  const cleaned = Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined)
  ) as T;
  return cleaned;
}

export async function postRequest(payload: Omit<BloodRequest, 'id' | 'status' | 'createdAt' | 'createdBy'>): Promise<string> {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error('Not authenticated');
  const id = push(ref(database, 'requests')).key!;
  const data: BloodRequest = {
    id,
    createdBy: uid,
    status: payload.requestedTo ? 'pending' : 'open',
    createdAt: Date.now(),
    patientName: payload.patientName,
    requiredBloodGroup: payload.requiredBloodGroup,
    city: payload.city,
    gender: payload.gender,
    hospital: payload.hospital,
    locationAddress: (payload as any).locationAddress,
    locationLat: (payload as any).locationLat,
    locationLng: (payload as any).locationLng,
    unitsRequired: payload.unitsRequired,
    neededBy: payload.neededBy,
    notes: payload.notes,
    requestedTo: payload.requestedTo,
  };
  await set(ref(database, `requests/${id}`), stripUndefined(data));
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

export async function getDonorStats(uid: string): Promise<{ totalReceived: number; accepted: number; rejected: number; }>{
  const snap = await get(ref(database, 'requests'));
  if (!snap.exists()) return { totalReceived: 0, accepted: 0, rejected: 0 };
  const all: BloodRequest[] = Object.values(snap.val());
  const mine = all.filter((r) => r.requestedTo === uid);
  const accepted = mine.filter((r) => r.status === 'accepted').length;
  const rejected = mine.filter((r) => r.status === 'rejected').length;
  return { totalReceived: mine.length, accepted, rejected };
}

export async function acceptRequest(id: string): Promise<void> {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error('Not authenticated');
  const snap = await get(ref(database, `requests/${id}`));
  if (!snap.exists()) throw new Error('Request not found');
  const current = snap.val() as BloodRequest;
  const updated: BloodRequest = {
    ...current,
    status: 'accepted',
    requestedTo: current.requestedTo ?? uid,
  };
  await set(ref(database, `requests/${id}`), stripUndefined(updated as unknown as Record<string, unknown>) as unknown as BloodRequest);
  
  // Automatically create donation record when accepting request
  const donationId = push(ref(database, `donations/${uid}`)).key!;
  const donationData: Donation = {
    id: donationId,
    requestId: id,
    status: 'pending',
    date: Date.now(),
  };
  await set(ref(database, `donations/${uid}/${donationId}`), donationData);
}

export async function rejectRequest(id: string): Promise<void> {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error('Not authenticated');
  const snap = await get(ref(database, `requests/${id}`));
  if (!snap.exists()) throw new Error('Request not found');
  const current = snap.val() as BloodRequest;
  // Only allow reject if it's targeted to me
  if (current.requestedTo && current.requestedTo !== uid) {
    throw new Error('Not allowed to reject this request');
  }
  const updated: BloodRequest = {
    ...current,
    status: 'rejected',
    requestedTo: current.requestedTo ?? uid,
  };
  await set(ref(database, `requests/${id}`), stripUndefined(updated as unknown as Record<string, unknown>) as unknown as BloodRequest);
}

export async function cancelRequest(id: string): Promise<void> {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error('Not authenticated');
  const snap = await get(ref(database, `requests/${id}`));
  if (!snap.exists()) throw new Error('Request not found');
  const current = snap.val() as BloodRequest;
  if (current.createdBy !== uid) {
    throw new Error('Only the creator can cancel this request');
  }
  const updated: BloodRequest = { ...current, status: 'cancelled' };
  await set(ref(database, `requests/${id}`), stripUndefined(updated as unknown as Record<string, unknown>) as unknown as BloodRequest);
}

export async function markFulfilled(id: string): Promise<void> {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error('Not authenticated');
  const snap = await get(ref(database, `requests/${id}`));
  if (!snap.exists()) throw new Error('Request not found');
  const current = snap.val() as BloodRequest;
  if (current.createdBy !== uid) {
    throw new Error('Only the creator can mark this request as fulfilled');
  }
  const updated: BloodRequest = { ...current, status: 'fulfilled' };
  await set(ref(database, `requests/${id}`), stripUndefined(updated as unknown as Record<string, unknown>) as unknown as BloodRequest);
}

export type ListRequestsFilters = {
  status?: BloodRequest['status'] | BloodRequest['status'][];
  city?: string;
  requiredBloodGroup?: string;
  createdBy?: string;
  requestedTo?: string;
  mineOnly?: boolean; // requests I created
  toMeOnly?: boolean; // targeted to me
  openOnly?: boolean; // status === 'open'
};

export async function listRequests(filters: ListRequestsFilters = {}): Promise<BloodRequest[]> {
  // For now, fetch all and filter client-side as per Project.md guidance
  const uid = auth.currentUser?.uid ?? undefined;
  const snap = await get(query(ref(database, 'requests')));
  if (!snap.exists()) return [];
  let items: BloodRequest[] = Object.values(snap.val() as Record<string, BloodRequest>);

  if (filters.status) {
    const statuses = Array.isArray(filters.status) ? filters.status : [filters.status];
    items = items.filter((r) => statuses.includes(r.status));
  }
  if (filters.city) items = items.filter((r) => r.city === filters.city);
  if (filters.requiredBloodGroup)
    items = items.filter((r) => r.requiredBloodGroup === filters.requiredBloodGroup);
  if (filters.createdBy) items = items.filter((r) => r.createdBy === filters.createdBy);
  if (filters.requestedTo) items = items.filter((r) => r.requestedTo === filters.requestedTo);
  if (filters.mineOnly && uid) items = items.filter((r) => r.createdBy === uid);
  if (filters.toMeOnly && uid) items = items.filter((r) => r.requestedTo === uid);
  if (filters.openOnly) items = items.filter((r) => r.status === 'open');

  // Sort newest first
  items.sort((a, b) => b.createdAt - a.createdAt);
  return items;
}

export async function listDonorInbox(): Promise<{ targeted: BloodRequest[]; discoverable: BloodRequest[] }> {
  const uid = auth.currentUser?.uid;
  if (!uid) return { targeted: [], discoverable: [] };
  
  const snap = await get(query(ref(database, 'requests')));
  if (!snap.exists()) return { targeted: [], discoverable: [] };
  const all: BloodRequest[] = Object.values(snap.val() as Record<string, BloodRequest>);
  
  const targeted = all
    .filter((r) => r.requestedTo === uid && r.status === 'pending')
    .sort((a, b) => b.createdAt - a.createdAt);
  
  const discoverable = all
    .filter((r) => r.status === 'open')
    .sort((a, b) => b.createdAt - a.createdAt);
  
  return { targeted, discoverable };
}



