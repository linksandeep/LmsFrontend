import api from './api';
import { Course, CreateCourseData, CourseFilters } from '../types/course';

export const courseService = {
  // Get all courses (public)
  async getCourses(filters?: CourseFilters) {
    const params = new URLSearchParams();
    if (filters) {
      if (filters.category) params.append('category', filters.category);
      if (filters.level) params.append('level', filters.level);
      if (filters.search) params.append('search', filters.search);
      if (filters.price) params.append('price', filters.price);
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());
    }
    const response = await api.get(`/courses?${params.toString()}`);
    return response.data;
  },

  // Get single course (public)
  async getCourse(id: string) {
    const response = await api.get(`/courses/${id}`);
    return response.data;
  },

  // Create course (teacher only)
  async createCourse(data: CreateCourseData) {
    console.log('Creating course with data:', data);
    const response = await api.post('/courses', data);
    console.log('Create course response:', response.data);
    return response.data;
  },

  // Update course (teacher only)
  async updateCourse(id: string, data: Partial<CreateCourseData>) {
    const response = await api.patch(`/courses/${id}`, data);
    return response.data;
  },

  // Delete course (teacher only)
  async deleteCourse(id: string) {
    const response = await api.delete(`/courses/${id}`);
    return response.data;
  },

  // Publish course (teacher only)
  async publishCourse(id: string) {
    const response = await api.patch(`/courses/${id}/publish`);
    return response.data;
  },

  // Unpublish course (teacher only)
  async unpublishCourse(id: string) {
    const response = await api.patch(`/courses/${id}/unpublish`);
    return response.data;
  },

  // Get teacher's courses
  async getMyCourses() {
    const response = await api.get('/users/courses');
    return response.data;
  }
};
