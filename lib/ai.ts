import { AIAPI } from '@/services/api';

export type AIContentType = 'request_suggestion' | 'donor_recommendation' | 'general_help' | 'blood_info';

export interface AIRequest {
  contentType: AIContentType;
  context: Record<string, any>;
}

export class AIAssistant {
  static async getRequestSuggestions(userProfile: any, bloodGroup?: string) {
    try {
      const context = {
        user_mode: userProfile?.mode,
        user_blood_group: userProfile?.bloodGroup,
        user_city: userProfile?.city,
        requested_blood_group: bloodGroup,
        timestamp: new Date().toISOString()
      };

      const result = await AIAPI.generateContent('request_suggestion', context);
      return result.content || 'I can help you create a blood request. What blood group do you need?';
    } catch (error) {
      console.error('AI request suggestion error:', error);
      return 'I can help you create a blood request. What blood group do you need?';
    }
  }

  static async getDonorRecommendations(userProfile: any, bloodGroup?: string, city?: string) {
    try {
      const context = {
        user_mode: userProfile?.mode,
        user_blood_group: userProfile?.bloodGroup,
        user_city: userProfile?.city,
        requested_blood_group: bloodGroup,
        requested_city: city,
        timestamp: new Date().toISOString()
      };

      const result = await AIAPI.generateContent('donor_recommendation', context);
      return result.content || 'I can help you find suitable donors. What blood group and city are you looking for?';
    } catch (error) {
      console.error('AI donor recommendation error:', error);
      return 'I can help you find suitable donors. What blood group and city are you looking for?';
    }
  }

  static async getBloodGroupInfo(bloodGroup: string) {
    try {
      const context = {
        blood_group: bloodGroup,
        timestamp: new Date().toISOString()
      };

      const result = await AIAPI.generateContent('blood_info', context);
      return result.content || `Here's information about blood group ${bloodGroup}.`;
    } catch (error) {
      console.error('AI blood info error:', error);
      return `Here's information about blood group ${bloodGroup}.`;
    }
  }

  static async getGeneralHelp(query: string) {
    try {
      const result = await AIAPI.enhancedSearch(query, 'general');
      return result.content || 'I can help you with blood donation questions. What would you like to know?';
    } catch (error) {
      console.error('AI general help error:', error);
      return 'I can help you with blood donation questions. What would you like to know?';
    }
  }

  static async getPersonalizedRecommendations(userProfile: any) {
    try {
      const recommendations = await AIAPI.getRecommendations();
      return recommendations || {
        suggestions: [
          'Consider updating your availability status',
          'Check for urgent blood requests in your area',
          'Review your donation history'
        ],
        insights: 'Based on your profile, here are some personalized recommendations.'
      };
    } catch (error) {
      console.error('AI recommendations error:', error);
      return {
        suggestions: [
          'Consider updating your availability status',
          'Check for urgent blood requests in your area',
          'Review your donation history'
        ],
        insights: 'Here are some general recommendations for you.'
      };
    }
  }
}
