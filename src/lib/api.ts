import axios from 'axios';

const API_BASE_URL = '/api';

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
export const ordersAPI = {
  create: (orderData: {
    items: any[];
    shipping_info: any;
    user_id?: number;
  }) => api.post('/orders', orderData),
  
  getAll: () => api.get('/orders'),
  updateStatus: (id: string, status: string) => 
    api.put(`/orders/${id}/status`, { status }),
};

// Profile API
export const profileAPI = {
  get: () => api.get('/profile'),
  update: (profileData: {
    full_name: string;
    phone: string;
    address: string;
  }) => api.put('/profile', profileData),
};

// Dashboard API
export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
};

// File upload API
export const uploadAPI = {
  uploadFile: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
};

// Test API connection
export const testAPI = () => api.get('/test');

export default api;