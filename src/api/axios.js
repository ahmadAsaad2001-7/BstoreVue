import axios from 'axios';

const api = axios.create({
  baseURL: 'https://yellowblueredbookstoreapi.runasp.net/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 8000, 
  withCredentials: true, 
});

// Request interceptor to attach token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
      window.location.href = '/#/login';
    }
    return Promise.reject(error);
  }
);

export default api;