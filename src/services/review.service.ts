import api from './api';
import { CreateReviewData } from '../types/review';

export const reviewService = {
  // Get course reviews
  async getCourseReviews(courseId: string, page = 1, limit = 10) {
    const response = await api.get(`/courses/${courseId}/reviews?page=${page}&limit=${limit}`);
    return response.data;
  },

  // Create review (enrolled students only)
  async createReview(courseId: string, data: CreateReviewData) {
    const response = await api.post(`/courses/${courseId}/reviews`, data);
    return response.data;
  },

  // Update review
  async updateReview(courseId: string, reviewId: string, data: Partial<CreateReviewData>) {
    const response = await api.patch(`/courses/${courseId}/reviews/${reviewId}`, data);
    return response.data;
  },

  // Delete review
  async deleteReview(courseId: string, reviewId: string) {
    const response = await api.delete(`/courses/${courseId}/reviews/${reviewId}`);
    return response.data;
  },

  // Mark review as helpful
  async markHelpful(courseId: string, reviewId: string) {
    const response = await api.post(`/courses/${courseId}/reviews/${reviewId}/helpful`);
    return response.data;
  },

  // Report review
  async reportReview(courseId: string, reviewId: string) {
    const response = await api.post(`/courses/${courseId}/reviews/${reviewId}/report`);
    return response.data;
  }
};
