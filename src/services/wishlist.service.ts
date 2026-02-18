import api from './api';

export const wishlistService = {
  // Get user's wishlist
  async getWishlist() {
    const response = await api.get('/wishlist');
    return response.data;
  },

  // Add course to wishlist
  async addToWishlist(courseId: string) {
    const response = await api.post('/wishlist', { courseId });
    return response.data;
  },

  // Remove from wishlist
  async removeFromWishlist(courseId: string) {
    const response = await api.delete(`/wishlist/${courseId}`);
    return response.data;
  },

  // Check if course is in wishlist
  async isInWishlist(courseId: string) {
    try {
      const response = await api.get(`/wishlist/check/${courseId}`);
      return response.data.inWishlist;
    } catch (error) {
      return false;
    }
  },

  // Clear wishlist
  async clearWishlist() {
    const response = await api.delete('/wishlist');
    return response.data;
  }
};
