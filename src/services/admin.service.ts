import api from './api';

export const adminService = {
  // Get dashboard statistics
  async getDashboardStats() {
    const response = await api.get('/admin/stats');
    return response.data;
  },

  // User management
  async getUsers(page = 1, limit = 10, role?: string) {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    if (role) params.append('role', role);
    
    const response = await api.get(`/admin/users?${params.toString()}`);
    return response.data;
  },

  async getUserById(userId: string) {
    const response = await api.get(`/admin/users/${userId}`);
    return response.data;
  },

  async updateUser(userId: string, userData: any) {
    const response = await api.patch(`/admin/users/${userId}`, userData);
    return response.data;
  },

  async deleteUser(userId: string) {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
  },

  // Category management
  async getCategories() {
    const response = await api.get('/categories');
    return response.data;
  },

  async createCategory(categoryData: { name: string; description?: string }) {
    const response = await api.post('/categories', categoryData);
    return response.data;
  },

  async updateCategory(categoryId: string, categoryData: any) {
    const response = await api.patch(`/categories/${categoryId}`, categoryData);
    return response.data;
  },

  async deleteCategory(categoryId: string) {
    const response = await api.delete(`/categories/${categoryId}`);
    return response.data;
  },

  // Reports
  async getRevenueReport(startDate?: string, endDate?: string) {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const response = await api.get(`/admin/reports/revenue?${params.toString()}`);
    return response.data;
  },

  async getEnrollmentReport() {
    const response = await api.get('/admin/reports/enrollments');
    return response.data;
  },

  async getCourseReport() {
    const response = await api.get('/admin/reports/courses');
    return response.data;
  },

  // System settings
  async getSettings() {
    const response = await api.get('/admin/settings');
    return response.data;
  },

  async updateSettings(settings: any) {
    const response = await api.patch('/admin/settings', settings);
    return response.data;
  },

  // Recent activity
  async getRecentActivity(limit = 10) {
    const response = await api.get(`/admin/activity?limit=${limit}`);
    return response.data;
  },

  // Get all courses (admin only)
async getAllCourses(page = 1, limit = 50, status?: string) {
  const params = new URLSearchParams();
  params.append('page', page.toString());
  params.append('limit', limit.toString());
  if (status) params.append('status', status);
  
  const response = await api.get(`/admin/courses?${params.toString()}`);
  return response.data;
}
};
