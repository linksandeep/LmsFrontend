import api from './api';
import { CreateLessonData } from '../types/lesson';

export const lessonService = {
  // Get all lessons for a course
  async getCourseLessons(courseId: string) {
    const response = await api.get(`/courses/${courseId}/lessons`);
    return response.data;
  },

  // Get single lesson
  async getLesson(courseId: string, lessonId: string) {
    const response = await api.get(`/courses/${courseId}/lessons/${lessonId}`);
    return response.data;
  },

  // Create lesson (teacher only)
  async createLesson(courseId: string, data: CreateLessonData) {
    const response = await api.post(`/courses/${courseId}/lessons`, data);
    return response.data;
  },

  // Update lesson (teacher only)
  async updateLesson(courseId: string, lessonId: string, data: Partial<CreateLessonData>) {
    const response = await api.patch(`/courses/${courseId}/lessons/${lessonId}`, data);
    return response.data;
  },

  // Delete lesson (teacher only)
  async deleteLesson(courseId: string, lessonId: string) {
    const response = await api.delete(`/courses/${courseId}/lessons/${lessonId}`);
    return response.data;
  },

  // Reorder lessons (teacher only)
  async reorderLessons(courseId: string, lessonOrders: { id: string; order: number }[]) {
    const response = await api.post(`/courses/${courseId}/lessons/reorder`, { lessonOrders });
    return response.data;
  },

  // Upload lesson video (teacher only)
  async uploadVideo(courseId: string, lessonId: string, videoFile: File) {
    const formData = new FormData();
    formData.append('video', videoFile);
    const response = await api.post(`/courses/${courseId}/lessons/${lessonId}/video`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
};
