import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  register: (username: string, email: string, password: string) =>
    api.post('/auth/register', { username, email, password }),
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password })
};

export const workoutService = {
  getAll: () => api.get('/workouts'),
  getById: (id: string) => api.get(`/workouts/${id}`),
  create: (workout: any) => api.post('/workouts', workout),
  update: (id: string, workout: any) => api.put(`/workouts/${id}`, workout),
  delete: (id: string) => api.delete(`/workouts/${id}`)
};

export default api;
