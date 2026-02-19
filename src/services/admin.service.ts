import api from './api';

export interface DashboardStats {
  totalUsers: number;
  totalStudents: number;
  totalTeachers: number;
  totalCourses: number;
  totalEnrollments: number;
  totalRevenue: number;
  pendingReviews: number;
  activeSessions: number;
  monthlyGrowth: number;
}

export interface Activity {
  id: string;
  user: string;
  avatar: string;
  action: string;
  target: string;
  time: string;
  type: string;
  icon: string;
  color: string;
}

export interface TopCourse {
  id: string;
  title: string;
  instructor: string;
  instructorEmail: string;
  students: number;
  revenue: number;
  rating: number;
  reviewCount: number;
  status: 'published' | 'draft';
}

export interface ChartData {
  label: string;
  revenue: number;
  count: number;
}

export interface TrendData {
  date: string;
  count: number;
}

export const adminService = {
  // ==================== DASHBOARD STATS ====================
  
  async getDashboardStats(): Promise<{ data: DashboardStats }> {
    const response = await api.get('/admin/stats');
    return response.data;
  },

  async getRevenueChart(period: 'monthly' | 'weekly' = 'monthly'): Promise<{ data: { chartData: ChartData[] } }> {
    const response = await api.get(`/admin/revenue-chart?period=${period}`);
    return response.data;
  },

  async getEnrollmentTrends(): Promise<{ data: { trends: TrendData[] } }> {
    const response = await api.get('/admin/enrollment-trends');
    return response.data;
  },

  async getTopCourses(limit: number = 10): Promise<{ data: { courses: TopCourse[] } }> {
    const response = await api.get(`/admin/top-courses?limit=${limit}`);
    return response.data;
  },

  async getRecentActivity(limit: number = 10): Promise<{ data: { activities: Activity[] } }> {
    const response = await api.get(`/admin/activity?limit=${limit}`);
    return response.data;
  },

  async getSystemHealth(): Promise<{ data: any }> {
    const response = await api.get('/admin/system-health');
    return response.data;
  },

  // ==================== USER MANAGEMENT ====================

  async getUsers(page = 1, limit = 10, role?: string, search?: string) {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    if (role) params.append('role', role);
    if (search) params.append('search', search);
    
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

  // ==================== COURSE MANAGEMENT ====================

  async getAllCourses(page = 1, limit = 50, status?: string, search?: string) {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    if (status) params.append('status', status);
    if (search) params.append('search', search);
    
    const response = await api.get(`/admin/courses?${params.toString()}`);
    return response.data;
  },

  async getCourseDetails(courseId: string) {
    const response = await api.get(`/admin/courses/${courseId}`);
    return response.data;
  },

  async publishCourse(courseId: string) {
    const response = await api.patch(`/admin/courses/${courseId}/publish`);
    return response.data;
  },

  async unpublishCourse(courseId: string) {
    const response = await api.patch(`/admin/courses/${courseId}/unpublish`);
    return response.data;
  },

  async updateCourse(courseId: string, courseData: any) {
    const response = await api.patch(`/admin/courses/${courseId}`, courseData);
    return response.data;
  },

  async deleteCourse(courseId: string) {
    const response = await api.delete(`/admin/courses/${courseId}`);
    return response.data;
  },

  // ==================== CATEGORY MANAGEMENT ====================

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

  // ==================== REPORTS ====================

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

  // ==================== SYSTEM SETTINGS ====================

  async getSettings() {
    const response = await api.get('/admin/settings');
    return response.data;
  },

  async updateSettings(settings: any) {
    const response = await api.patch('/admin/settings', settings);
    return response.data;
  }
};