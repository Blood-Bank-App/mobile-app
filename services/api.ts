import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import Constants from 'expo-constants';

// API Configuration
const getApiBaseUrl = () => {
  // Try to get from Constants first (from app.json extra section)
  const configUrl = Constants.expoConfig?.extra?.apiBaseUrl as string | undefined;
  if (configUrl) return configUrl;
  
  // Fallback to environment variable
  const envUrl = process.env.EXPO_PUBLIC_API_BASE_URL;
  if (envUrl) return envUrl;
  
  // Check if we're running on web (localhost) or mobile (IP)
  const isWeb = typeof window !== 'undefined' && window.location.hostname === 'localhost';
  return isWeb ? 'http://localhost:8000/api' : 'http://192.168.100.3:8000/api';
};

const API_BASE_URL = getApiBaseUrl();

// Debug: Log the API URL being used
console.log('🔗 API Base URL:', API_BASE_URL);
console.log('📱 Expo Config:', Constants.expoConfig?.extra);
console.log('🌐 Environment:', typeof window !== 'undefined' ? 'Web' : 'Mobile');

// Token storage keys
const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add debugging interceptors
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Token management
export const tokenManager = {
  async getAccessToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
    } catch (error) {
      console.error('Error getting access token:', error);
      return null;
    }
  },

  async getRefreshToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error('Error getting refresh token:', error);
      return null;
    }
  },

  async setTokens(accessToken: string, refreshToken: string): Promise<void> {
    try {
      await AsyncStorage.multiSet([
        [ACCESS_TOKEN_KEY, accessToken],
        [REFRESH_TOKEN_KEY, refreshToken],
      ]);
    } catch (error) {
      console.error('Error setting tokens:', error);
    }
  },

  async clearTokens(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY]);
    } catch (error) {
      console.error('Error clearing tokens:', error);
    }
  },
};

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    const token = await tokenManager.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Combined response interceptor for logging, auth handling, and error management
api.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  async (error) => {
    console.error('❌ Response Error:', error.message);
    
    // Log network errors
    if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
      console.error('🔌 Network Error - Check if backend server is running on:', API_BASE_URL);
    }

    const originalRequest = error.config;

    // Handle 401 Unauthorized - try token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await tokenManager.getRefreshToken();
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refresh_token: refreshToken,
          });

          const { access_token } = response.data;
          await tokenManager.setTokens(access_token, refreshToken);

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        await tokenManager.clearTokens();
        console.log('Token refresh failed, redirecting to login');
      }
    }

    // Handle 403 Forbidden - user not authenticated or insufficient permissions
    if (error.response?.status === 403) {
      console.log('403 Forbidden - User not authenticated or insufficient permissions');
      // Don't crash the app, just reject with a clean error
      return Promise.reject(new Error('Access denied. Please log in.'));
    }

    return Promise.reject(error);
  }
);

// API Service Classes
export class AuthAPI {
  static async register(userData: {
    email: string;
    password: string;
    name: string;
    gender?: string;
    bloodGroup?: string;
    city?: string;
    cnic?: string;
    phone?: string;
    mode?: string;
  }) {
    const response = await api.post('/auth/register', userData);
    const { access_token, refresh_token, user } = response.data;
    
    await tokenManager.setTokens(access_token, refresh_token);
    return { user, access_token, refresh_token };
  }

  static async login(email: string, password: string) {
    const response = await api.post('/auth/login', { email, password });
    const { access_token, refresh_token, user } = response.data;
    
    await tokenManager.setTokens(access_token, refresh_token);
    return { user, access_token, refresh_token };
  }

  static async logout() {
    await tokenManager.clearTokens();
  }

  static async requestPasswordReset(email: string) {
    return await api.post('/auth/reset-password', { email });
  }

  static async confirmPasswordReset(token: string, newPassword: string) {
    return await api.post('/auth/confirm-reset', { token, new_password: newPassword });
  }

  static async changePassword(currentPassword: string, newPassword: string) {
    return await api.post('/auth/change-password', {
      current_password: currentPassword,
      new_password: newPassword,
    });
  }

  static async completeOnboarding(onboardingData: {
    name: string;
    gender: string;
    bloodGroup: string;
    city: string;
    phone: string;
    cnic?: string;
    mode?: string;
    available?: boolean;
  }) {
    return await api.post('/auth/complete-onboarding', onboardingData);
  }
}

export class UserAPI {
  static async getProfile() {
    const response = await api.get('/users/profile');
    return response.data.data;
  }

  static async updateProfile(profileData: any) {
    const response = await api.put('/users/profile', profileData);
    return response.data.data;
  }

  static async listAvailableDonors(filters?: {
    bloodGroup?: string;
    city?: string;
    gender?: string;
    skip?: number;
    limit?: number;
  }) {
    const response = await api.get('/users/donors', { params: filters });
    return response.data.data;
  }

  static async toggleAvailability(available: boolean) {
    return await api.put('/users/availability', { available });
  }

  static async switchMode(mode: 'donor' | 'patient') {
    return await api.put('/users/mode', { mode });
  }

  static async getUserStats() {
    const response = await api.get('/users/stats');
    return response.data.data;
  }

  static async getUserById(userId: string) {
    const response = await api.get(`/users/${userId}`);
    return response.data.data;
  }
}

export class RequestAPI {
  static async createRequest(requestData: {
    patientName: string;
    requiredBloodGroup: string;
    city: string;
    gender?: string;
    hospital?: string;
    locationAddress?: string;
    locationLat?: number;
    locationLng?: number;
    unitsRequired?: number;
    neededBy?: string;
    notes?: string;
    requestedTo?: string;
  }) {
    const response = await api.post('/requests', requestData);
    return response.data.data;
  }

  static async listRequests(filters?: {
    status?: string;
    city?: string;
    requiredBloodGroup?: string;
    mineOnly?: boolean;
    toMeOnly?: boolean;
    openOnly?: boolean;
    includeMatchScores?: boolean;
    skip?: number;
    limit?: number;
  }) {
    const response = await api.get('/requests', { params: filters });
    return response.data.data;
  }

  static async getRequestById(requestId: string) {
    const response = await api.get(`/requests/${requestId}`);
    return response.data.data;
  }

  static async acceptRequest(requestId: string) {
    const response = await api.put(`/requests/${requestId}/accept`);
    return response.data.data;
  }

  static async rejectRequest(requestId: string) {
    const response = await api.put(`/requests/${requestId}/reject`);
    return response.data.data;
  }

  static async cancelRequest(requestId: string) {
    const response = await api.put(`/requests/${requestId}/cancel`);
    return response.data.data;
  }

  static async markFulfilled(requestId: string) {
    const response = await api.put(`/requests/${requestId}/fulfill`);
    return response.data.data;
  }

  static async getDonorInbox() {
    const response = await api.get('/requests/inbox');
    return response.data.data;
  }
}

export class DonationAPI {
  static async listBloodDonations() {
    const response = await api.get('/donations/blood');
    return response.data.data;
  }

  static async updateDonationStatus(donationId: string, status: string) {
    const response = await api.put(`/donations/blood/${donationId}`, { status });
    return response.data.data;
  }

  static async createPaymentIntent(amount: number, currency: string = 'PKR', purpose?: string) {
    const response = await api.post('/donations/money/intent', {
      amount,
      currency,
      purpose,
    });
    return response.data.data;
  }

  static async confirmMoneyDonation(paymentIntentId: string, amount: number, currency: string = 'PKR', purpose?: string) {
    const response = await api.post('/donations/money/confirm', {
      payment_intent_id: paymentIntentId,
      amount,
      currency,
      purpose,
    });
    return response.data.data;
  }

  static async listMoneyDonations() {
    const response = await api.get('/donations/money');
    return response.data.data;
  }

  static async getDonationStats() {
    const response = await api.get('/donations/stats');
    return response.data.data;
  }
}

export class CommentAPI {
  static async createComment(requestId: string, text: string) {
    const response = await api.post('/comments', { requestId, text });
    return response.data.data;
  }

  static async listRequestComments(requestId: string) {
    const response = await api.get(`/comments/${requestId}`);
    return response.data.data;
  }

  static async updateComment(commentId: string, text: string) {
    const response = await api.put(`/comments/${commentId}`, { text });
    return response.data.data;
  }

  static async deleteComment(commentId: string) {
    return await api.delete(`/comments/${commentId}`);
  }
}

export class NotificationAPI {
  static async listNotifications(unreadOnly: boolean = false) {
    const response = await api.get('/notifications', { params: { unread_only: unreadOnly } });
    return response.data.data;
  }

  static async markAsRead(notificationId: string) {
    return await api.put(`/notifications/${notificationId}/read`);
  }

  static async markAllAsRead() {
    return await api.put('/notifications/mark-all-read');
  }
}

export class ChatAPI {
  static async createSession() {
    const response = await api.post('/chat/sessions');
    return response.data.data;
  }

  static async listSessions() {
    const response = await api.get('/chat/sessions');
    return response.data.data;
  }

  static async sendMessage(sessionId: string, content: string, attachments?: any[]) {
    const response = await api.post(`/chat/sessions/${sessionId}/messages`, {
      sessionId,
      content,
      attachments,
    });
    return response.data.data;
  }

  static async getSessionMessages(sessionId: string) {
    const response = await api.get(`/chat/sessions/${sessionId}/messages`);
    return response.data.data;
  }

  static async uploadFile(file: any) {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post('/chat/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  }
}

export class AIAPI {
  static async enhancedSearch(query: string, searchType: string = 'general') {
    const response = await api.post('/ai/search', { query, search_type: searchType });
    return response.data.data;
  }

  static async getRecommendations() {
    const response = await api.get('/ai/recommendations');
    return response.data.data;
  }

  static async generateContent(contentType: string, context: any) {
    const response = await api.post('/ai/generate-content', {
      content_type: contentType,
      context,
    });
    return response.data.data;
  }
}

export default api;
