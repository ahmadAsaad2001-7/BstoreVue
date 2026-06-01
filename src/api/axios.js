import axios from 'axios';

const api = axios.create({
  baseURL:  '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 8000, 
  withCredentials: true, // Automatically sends cookies with requests
});

// Response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authUser');
      window.location.href = '/#/login';
    }
    return Promise.reject(error);
  }
);

export default api;