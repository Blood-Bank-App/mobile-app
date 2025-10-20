import { UserAPI } from '@/services/api';
import { UserProfile } from './types';

export async function saveUserProfile(partial: Partial<UserProfile>): Promise<UserProfile> {
  try {
    const updatedProfile = await UserAPI.updateProfile(partial);
    return updatedProfile;
  } catch (error) {
    console.error('Error saving user profile:', error);
    throw error;
  }
}

export async function getUserProfile(uid?: string): Promise<UserProfile | null> {
  try {
    const profile = await UserAPI.getProfile();
    return profile;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
}

export async function listAvailableDonors(filters?: {
  bloodGroup?: string;
  city?: string;
  gender?: string;
}): Promise<UserProfile[]> {
  try {
    const donors = await UserAPI.listAvailableDonors(filters);
    return donors;
  } catch (error) {
    console.error('Error listing available donors:', error);
    return [];
  }
}

export async function listAllUsers(): Promise<UserProfile[]> {
  try {
    // This would be an admin-only endpoint
    // For now, return empty array as regular users can't list all users
    return [];
  } catch (error) {
    console.error('Error listing all users:', error);
    return [];
  }
}

export async function setAvailability(available: boolean): Promise<void> {
  try {
    await UserAPI.toggleAvailability(available);
  } catch (error) {
    console.error('Error setting availability:', error);
    throw error;
  }
}

export async function switchUserMode(mode: 'donor' | 'patient'): Promise<UserProfile> {
  try {
    const updatedProfile = await UserAPI.switchMode(mode);
    return updatedProfile;
  } catch (error) {
    console.error('Error switching user mode:', error);
    throw error;
  }
}

export async function getUserStats(): Promise<any> {
  try {
    const stats = await UserAPI.getUserStats();
    return stats;
  } catch (error) {
    console.error('Error getting user stats:', error);
    throw error;
  }
}


