import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:9000/api/v1';

console.log('🔧 API URL:', API_URL);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    console.log('📡 Request:', config.method?.toUpperCase(), config.url);
    console.log('📡 Token exists:', !!token);
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('📡 Token added to request');
    }
    
    return config;
  },
  (error) => {
    console.error('📡 Request error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log('✅ Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', {
      status: error.response?.status,
      url: error.config?.url,
      message: error.response?.data?.message || error.message
    });
    
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/register') {
        console.log('🔄 Unauthorized - redirecting to login');
        // Don't remove token immediately, let the user see the error
        // They can click login button on the error page
      }
    }
    return Promise.reject(error);
  }
);

export default api;