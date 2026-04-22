import axios from 'axios';


const api = axios.create({
  baseURL: 'http://localhost:5161/api' ,
  headers: { 'Content-Type': 'application/json' },
  timeout: 8000, 
  withCredentials: true, 
});

export default api;