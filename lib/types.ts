export type Gender = 'Male' | 'Female' | 'Other';
export type BloodGroup = 'A+'|'A-'|'B+'|'B-'|'O+'|'O-'|'AB+'|'AB-';

export type UserProfile = {
  uid: string;
  name?: string;
  email?: string;
  gender?: Gender;
  bloodGroup?: BloodGroup;
  city?: string;
  phone?: string;
  cnic?: string;
  available?: boolean;
  mode?: 'donor'|'patient';
  themePreference?: 'system'|'light'|'dark';
  createdAt?: number;
  updatedAt?: number;
};

export type BloodRequestStatus = 'pending'|'open'|'accepted'|'rejected'|'fulfilled'|'cancelled';

export type BloodRequest = {
  id: string;
  createdBy: string;
  patientName: string;
  requiredBloodGroup: BloodGroup;
  city: string;
  gender?: Gender;
  hospital?: string;
  locationAddress?: string;
  locationLat?: number;
  locationLng?: number;
  unitsRequired?: number;
  neededBy?: number;
  notes?: string;
  requestedTo?: string;
  status: BloodRequestStatus;
  createdAt: number;
};

export type DonationStatus = 'pending'|'completed'|'cancelled';

export type Donation = {
  id: string;
  requestId: string;
  status: DonationStatus;
  date: number;
};

export type Comment = {
  id: string;
  uid: string;
  text: string;
  createdAt: number;
};

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
  mode?: 'donor' | 'patient';
  themePreference?: 'system' | 'light' | 'dark';
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
  locationAddress?: string;
  locationLat?: number;
  locationLng?: number;
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
  stripePaymentId?: string;
  stripeSessionId?: string;
};

export type Organization = {
  id: string;
  name: string;
  type: 'hospital' | 'ngo';
  city: string;
  address?: string;
  locationLat?: number;
  locationLng?: number;
  phone?: string;
  email?: string;
  website?: string;
  logoUrl?: string;
  verified: boolean;
  createdAt: number;
  updatedAt: number;
  createdBy: string;
};

export type OrgSubscription = {
  orgId: string;
  plan: 'basic' | 'premium';
  status: 'active' | 'cancelled' | 'past_due';
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  currentPeriodStart: number;
  currentPeriodEnd: number;
  createdAt: number;
  updatedAt: number;
};


