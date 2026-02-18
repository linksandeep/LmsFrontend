import axios from 'axios';

const API_URL = 'http://localhost:9000/api/v1';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling - BUT NOT for login page
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only redirect to login if NOT on login page and NOT on register page
    const currentPath = window.location.pathname;
    if (error.response?.status === 401 && 
        currentPath !== '/login' && 
        currentPath !== '/register' &&
        !currentPath.includes('/forgot-password')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
