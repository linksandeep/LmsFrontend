import api from './api';

export const enrollmentService = {
  // Enroll in a course
  async enrollInCourse(courseId: string) {
    const response = await api.post(`/enrollments/${courseId}/enroll`);
    return response.data;
  },

  // Get user's enrollments
  async getMyEnrollments() {
    const response = await api.get('/enrollments/my-enrollments');
    return response.data;
  },

  // Get single enrollment details
  async getEnrollment(enrollmentId: string) {
    const response = await api.get(`/enrollments/${enrollmentId}`);
    return response.data;
  },

  // Check if user is enrolled in a course
  async checkEnrollment(courseId: string) {
    try {
      const response = await api.get(`/enrollments/my-enrollments`);
      const enrollments = response.data.data?.enrollments || [];
      return enrollments.some((e: any) => e.course?.id === courseId || e.course === courseId);
    } catch (error) {
      console.error('Failed to check enrollment:', error);
      return false;
    }
  },

  // Update lesson progress
  async updateProgress(enrollmentId: string, lessonId: string, completed: boolean) {
    const response = await api.patch(`/enrollments/${enrollmentId}/progress`, {
      lessonId,
      completed
    });
    return response.data;
  },

  // Complete course
  async completeCourse(enrollmentId: string) {
    const response = await api.post(`/enrollments/${enrollmentId}/complete`);
    return response.data;
  },

  // Get course students (teacher only)
  async getCourseStudents(courseId: string) {
    const response = await api.get(`/enrollments/${courseId}/students`);
    return response.data;
  }
};
