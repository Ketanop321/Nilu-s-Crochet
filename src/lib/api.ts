import axios from 'axios';

export const API_BASE_URL: string = (import.meta as any)?.env?.VITE_API_BASE_URL || '/api';
export const ORIGIN_BASE_URL: string = API_BASE_URL.replace(/\/api\/?$/, '');

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  login: (credentials: { username: string; password: string }) =>
    api.post('/auth/login', credentials),
  
  register: (userData: {
    username: string;
    email: string;
    password: string;
    full_name?: string;
    phone?: string;
    address?: string;
  }) => api.post('/auth/register', userData),
};

// Products API
export const productsAPI = {
  getAll: () => api.get('/products'),
  getById: (id: string) => api.get(`/products/${id}`),
  create: (formData: FormData) => api.post('/products', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id: string, formData: FormData) => api.put(`/products/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id: string) => api.delete(`/products/${id}`),
};

// Orders API

// File upload API
export const uploadAPI = {
  uploadFile: (file: File) => {
    const formData = new FormData();
    // Backend expects 'image'
    formData.append('image', file);
    return api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
};

// (intentionally left minimal) add additional API modules as needed

export default api;