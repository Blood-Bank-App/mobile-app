import { DonationAPI } from '@/services/api';
import { Donation, MoneyDonation } from './types';

export async function createDonationRecord(requestId: string, donorUid: string): Promise<string> {
  // This is now handled automatically by the backend when accepting a request
  // Return a placeholder ID for compatibility
  return 'auto-generated';
}

export async function listMyDonations(uid?: string): Promise<Donation[]> {
  try {
    const donations = await DonationAPI.listBloodDonations();
    return donations;
  } catch (error) {
    console.error('Error listing blood donations:', error);
    return [];
  }
}

// Create Stripe payment intent for money donation via Python backend
export async function createStripePaymentIntent({ 
  amount, 
  currency = 'PKR', 
  purpose 
}: {
  amount: number;
  currency?: string;
  purpose?: string;
}): Promise<string> {
  try {
    const paymentIntent = await DonationAPI.createPaymentIntent(amount, currency, purpose);
    return paymentIntent.client_secret;
  } catch (error) {
    console.error('Stripe payment intent creation failed:', error);
    throw error;
  }
}

// Record completed money donation after Stripe confirmation
export async function recordMoneyDonation(data: Omit<MoneyDonation, 'id' | 'createdAt' | 'uid'> & { 
  amount: number; 
  currency?: string;
  stripePaymentId?: string;
  stripeSessionId?: string;
}): Promise<string> {
  try {
    const donation = await DonationAPI.confirmMoneyDonation(
      data.stripePaymentId || '',
      data.amount,
      data.currency || 'PKR',
      data.purpose
    );
    return donation.id;
  } catch (error) {
    console.error('Error recording money donation:', error);
    throw error;
  }
}

export async function listMyMoneyDonations(uid?: string): Promise<MoneyDonation[]> {
  try {
    const donations = await DonationAPI.listMoneyDonations();
    return donations;
  } catch (error) {
    console.error('Error listing money donations:', error);
    return [];
  }
}

export async function updateDonationStatus(donationId: string, status: string): Promise<Donation> {
  try {
    const updatedDonation = await DonationAPI.updateDonationStatus(donationId, status);
    return updatedDonation;
  } catch (error) {
    console.error('Error updating donation status:', error);
    throw error;
  }
}

export async function getDonationStats(): Promise<any> {
  try {
    const stats = await DonationAPI.getDonationStats();
    return stats;
  } catch (error) {
    console.error('Error getting donation stats:', error);
    throw error;
  }
}


