// utils/auth.js
import axios from "axios";


const api = axios.create({
  baseURL: "http://localhost:5161/api",
  headers: { 
    "Content-Type": "application/json",
    "Accept": "application/json"
  },
  timeout: 8000,
  withCredentials: true, 
});
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const Login = async (email, password) => {
  console.log("Attempting login with email:", email);
  try {
    const response = await api.post("/user/login", { email, password });
    console.log("Login successful:", response.data);
   
    return response.data;
  } catch (error) {
    console.error("Login failed:", error.response?.data || error.message);
    throw error;
  }   
};

export const Logout = async () => {
  console.log("Logging out...");
  try {
   
    await api.post("/api/auth/logout"); 
    

    localStorage.removeItem('user'); 
    
    console.log("Logout successful");
    return true;
  } catch (error) {
    console.error("Logout failed:", error.message);
    
    window.location.href = '/login';
    throw error;
  }
};


export const IsAuthenticated = async () => {
  try {
    const response = await api.get("/user/check-auth");
    
    return {
      authenticated: true,
      user: response.data.user 
    };
  } catch (error) {
    
    if (error.response?.status === 401 || error.response?.status === 403) {
      return { authenticated: false, user: null };
    }

    console.error("Auth check failed:", error.message);
    return { authenticated: false, user: null };
  }
};

export const ProfileInfo = async (id) => {
  console.log("Fetching user info...");
  try {
    const response = await api.get(`/user/${id}`);
    console.log("User info fetched:", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch user info:", error.response?.data || error.message);
    throw error;
  }
};


export const myInfo = async () => {
  console.log("Fetching my info...");
  try {
    
    const response = await api.get("/user/myinfo");
    console.log("My info fetched:", response.data);
    return response.data; 
  } catch (error) {
    console.error("Failed to fetch my info:", error.response?.data || error.message);
    
    // Auto-redirect on auth errors
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('user'); 
      window.location.href = '/login';
    }
    throw error;
  }   
};


export const getCurrentUserId = async () => {
  try {
    const user = await myInfo();
    return user?.id;
  } catch {
    return null;
  }
};

export { api }; 