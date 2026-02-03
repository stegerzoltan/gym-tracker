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

export const exerciseService = {
  getAll: () => api.get('/exercises'),
  search: (params: any) => api.get('/exercises/search', { params }),
  create: (exercise: any) => api.post('/exercises', exercise),
  seed: () => api.post('/exercises/seed')
};

export const measurementService = {
  getAll: () => api.get('/measurements'),
  create: (measurement: any) => api.post('/measurements', measurement),
  update: (id: string, measurement: any) => api.put(`/measurements/${id}`, measurement),
  delete: (id: string) => api.delete(`/measurements/${id}`)
};

export const templateService = {
  getAll: () => api.get('/templates'),
  getById: (id: string) => api.get(`/templates/${id}`),
  create: (template: any) => api.post('/templates', template),
  delete: (id: string) => api.delete(`/templates/${id}`)
};

export const goalService = {
  getAll: () => api.get('/goals'),
  create: (goal: any) => api.post('/goals', goal),
  update: (id: string, data: any) => api.put(`/goals/${id}`, data),
  delete: (id: string) => api.delete(`/goals/${id}`)
};

export const analyticsService = {
  getStats: () => api.get('/analytics/stats'),
  getExerciseProgress: (exerciseName: string) => api.get(`/analytics/exercise/${exerciseName}`)
};

export default api;
