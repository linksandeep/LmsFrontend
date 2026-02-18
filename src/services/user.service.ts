import api from './api';

export const userService = {
  async getProfile() {
    const response = await api.get('/users/profile');
    return response.data;
  },

  async updateProfile(data: { name?: string; bio?: string; expertise?: string[] }) {
    const response = await api.patch('/users/profile', data);
    return response.data;
  },

  async updateProfilePicture(formData: FormData) {
    const response = await api.post('/users/profile/picture', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async getTeachers() {
    const response = await api.get('/users/teachers');
    return response.data;
  },

  async getUserCourses() {
    const response = await api.get('/users/courses');
    return response.data;
  }
};
