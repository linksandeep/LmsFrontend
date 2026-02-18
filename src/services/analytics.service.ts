import api from './api';

export const analyticsService = {
  // Get teacher analytics overview
  async getTeacherAnalytics() {
    const response = await api.get('/analytics/teacher');
    return response.data;
  },

  // Get course-specific analytics
  async getCourseAnalytics(courseId: string) {
    const response = await api.get(`/analytics/course/${courseId}`);
    return response.data;
  },

  // Get students enrolled in a course (with progress)
  async getCourseStudents(courseId: string) {
    const response = await api.get(`/analytics/course/${courseId}/students`);
    return response.data;
  },

  // Get student progress in a course
  async getStudentProgress(courseId: string, studentId: string) {
    const response = await api.get(`/analytics/course/${courseId}/student/${studentId}`);
    return response.data;
  },

  // Get revenue reports
  async getRevenueReport(startDate?: string, endDate?: string) {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    const response = await api.get(`/analytics/revenue?${params.toString()}`);
    return response.data;
  },

  // Get engagement metrics
  async getEngagementMetrics(courseId: string) {
    const response = await api.get(`/analytics/course/${courseId}/engagement`);
    return response.data;
  }
};
