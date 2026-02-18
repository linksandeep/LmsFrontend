import api from './api';

export const emailService = {
  // Get email preferences
  async getPreferences() {
    const response = await api.get('/notifications/preferences');
    return response.data;
  },

  // Update email preferences
  async updatePreferences(preferences: any) {
    const response = await api.patch('/notifications/preferences', preferences);
    return response.data;
  },

  // Test email configuration
  async testEmail() {
    const response = await api.post('/notifications/test');
    return response.data;
  },

  // Get email history
  async getHistory(page = 1, limit = 20) {
    const response = await api.get(`/notifications/history?page=${page}&limit=${limit}`);
    return response.data;
  },

  // Resend email
  async resendEmail(notificationId: string) {
    const response = await api.post(`/notifications/resend/${notificationId}`);
    return response.data;
  }
};
