import api from './api';

export const progressService = {
  // Get student's course progress
  async getMyProgress() {
    const response = await api.get('/enrollments/my-enrollments');
    return response.data;
  },

  // Get progress for a specific course
  async getCourseProgress(courseId: string) {
    const response = await api.get(`/enrollments/course/${courseId}/progress`);
    return response.data;
  },

  // Update lesson progress
  async updateLessonProgress(enrollmentId: string, lessonId: string, completed: boolean, position?: number) {
    const response = await api.patch(`/enrollments/${enrollmentId}/progress`, {
      lessonId,
      completed,
      position
    });
    return response.data;
  },

  // Get continue learning items (recently accessed courses)
  async getContinueLearning() {
    const response = await api.get('/enrollments/continue-learning');
    return response.data;
  },

  // Get student statistics
  async getStudentStats() {
    const response = await api.get('/enrollments/stats');
    return response.data;
  },

  // Generate certificate for completed course
  async generateCertificate(enrollmentId: string) {
    const response = await api.post(`/enrollments/${enrollmentId}/certificate`);
    return response.data;
  }
};
