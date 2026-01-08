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
  locationLat?: number;
  locationLng?: number;
  createdAt: number;
  updatedAt: number;
};

export type MatchScore = {
  matchScore: number;
  distanceKm?: number;
  distanceScore: number;
  bloodTypeScore: number;
  eligibilityScore: number;
  reliabilityScore: number;
  weights?: {
    distance: number;
    bloodType: number;
    eligibility: number;
    reliability: number;
  };
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
  matchScore?: MatchScore; // Match score for current user (if donor)
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


