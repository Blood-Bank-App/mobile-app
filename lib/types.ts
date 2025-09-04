export type UserProfile = {
  uid: string;
  name: string;
  email?: string;
  gender?: string;
  bloodGroup?: string;
  city?: string;
  cnic?: string;
  phone?: string;
  available?: boolean;
  createdAt: number;
  updatedAt: number;
};

export type BloodRequest = {
  id: string;
  createdBy: string;
  patientName: string;
  requiredBloodGroup: string;
  city: string;
  gender?: string;
  hospital?: string;
  unitsRequired?: number;
  neededBy?: number;
  notes?: string;
  requestedTo?: string; // specific donor uid
  status: 'open' | 'pending' | 'accepted' | 'rejected' | 'fulfilled' | 'cancelled';
  createdAt: number;
};

export type Donation = {
  id: string;
  requestId: string;
  status: 'pending' | 'donated' | 'cancelled';
  date: number;
};

export type Comment = {
  id: string;
  uid: string;
  text: string;
  createdAt: number;
};

export type MoneyDonation = {
  id: string;
  uid: string; // donor
  amount: number;
  currency: string;
  purpose?: string;
  createdAt: number;
  receiptUrl?: string;
};


