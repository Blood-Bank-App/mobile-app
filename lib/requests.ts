import { RequestAPI } from '@/services/api';
import { BloodRequest } from './types';

export async function postRequest(payload: Omit<BloodRequest, 'id' | 'status' | 'createdAt' | 'createdBy'>): Promise<string> {
  try {
    const request = await RequestAPI.createRequest({
      patientName: payload.patientName,
      requiredBloodGroup: payload.requiredBloodGroup,
      city: payload.city,
      gender: payload.gender,
      hospital: payload.hospital,
      locationAddress: payload.locationAddress,
      locationLat: payload.locationLat,
      locationLng: payload.locationLng,
      unitsRequired: payload.unitsRequired,
      neededBy: payload.neededBy ? new Date(payload.neededBy).toISOString() : undefined,
      notes: payload.notes,
      requestedTo: payload.requestedTo,
    });
    return request.id;
  } catch (error) {
    console.error('Error creating request:', error);
    throw error;
  }
}

export async function listMyRequests(uid?: string): Promise<BloodRequest[]> {
  try {
    const requests = await RequestAPI.listRequests({ mineOnly: true });
    return requests;
  } catch (error) {
    console.error('Error listing my requests:', error);
    return [];
  }
}

export async function getRequestById(id: string): Promise<BloodRequest | null> {
  try {
    const request = await RequestAPI.getRequestById(id);
    return request;
  } catch (error) {
    console.error('Error getting request by ID:', error);
    return null;
  }
}

export async function getDonorStats(uid: string): Promise<{ totalReceived: number; accepted: number; rejected: number; }> {
  try {
    // This would need to be implemented in the API
    // For now, return default values
    return { totalReceived: 0, accepted: 0, rejected: 0 };
  } catch (error) {
    console.error('Error getting donor stats:', error);
    return { totalReceived: 0, accepted: 0, rejected: 0 };
  }
}

export async function acceptRequest(id: string): Promise<void> {
  try {
    await RequestAPI.acceptRequest(id);
  } catch (error) {
    console.error('Error accepting request:', error);
    throw error;
  }
}

export async function rejectRequest(id: string): Promise<void> {
  try {
    await RequestAPI.rejectRequest(id);
  } catch (error) {
    console.error('Error rejecting request:', error);
    throw error;
  }
}

export async function cancelRequest(id: string): Promise<void> {
  try {
    await RequestAPI.cancelRequest(id);
  } catch (error) {
    console.error('Error cancelling request:', error);
    throw error;
  }
}

export async function markFulfilled(id: string): Promise<void> {
  try {
    await RequestAPI.markFulfilled(id);
  } catch (error) {
    console.error('Error marking request as fulfilled:', error);
    throw error;
  }
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
  includeMatchScores?: boolean; // include match scores for current user (if donor)
};

export async function listRequests(filters: ListRequestsFilters = {}): Promise<BloodRequest[]> {
  try {
    const requests = await RequestAPI.listRequests(filters);
    return requests;
  } catch (error) {
    console.error('Error listing requests:', error);
    return [];
  }
}

export async function listDonorInbox(): Promise<{ targeted: BloodRequest[]; discoverable: BloodRequest[] }> {
  try {
    const inbox = await RequestAPI.getDonorInbox();
    return inbox;
  } catch (error) {
    console.error('Error getting donor inbox:', error);
    return { targeted: [], discoverable: [] };
  }
}



