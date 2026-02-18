import api from './api';
import { Course, CreateCourseData, CourseFilters } from '../types/course';

export const courseService = {
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

  async getCourse(id: string) {
    console.log('🔍 courseService.getCourse called with ID:', id);
    const token = localStorage.getItem('token');
    console.log('Token exists:', !!token);
    
    try {
      const response = await api.get(`/courses/${id}`);
      console.log('✅ Course API response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Course API error:', error.response?.data || error.message);
      throw error;
    }
  },

  async createCourse(data: CreateCourseData) {
    console.log('Creating course with data:', data);
    const response = await api.post('/courses', data);
    console.log('Create course response:', response.data);
    return response.data;
  },

  async updateCourse(id: string, data: Partial<CreateCourseData>) {
    const response = await api.patch(`/courses/${id}`, data);
    return response.data;
  },

  async deleteCourse(id: string) {
    const response = await api.delete(`/courses/${id}`);
    return response.data;
  },

  async publishCourse(id: string) {
    const response = await api.patch(`/courses/${id}/publish`);
    return response.data;
  },

  async unpublishCourse(id: string) {
    const response = await api.patch(`/courses/${id}/unpublish`);
    return response.data;
  },

  async getMyCourses() {
    const response = await api.get('/courses/teacher/mine');
    return response.data;
  }
};