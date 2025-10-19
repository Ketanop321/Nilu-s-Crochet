import axios from 'axios';

// Force production API URL for deployment
const PRODUCTION_API_URL = 'https://nilu-s-crochet.onrender.com/api';
const DEV_API_URL = '/api';

export const API_BASE_URL: string = 
  (import.meta as any)?.env?.VITE_API_BASE_URL || 
  ((import.meta as any).env?.PROD ? PRODUCTION_API_URL : DEV_API_URL);

export const ORIGIN_BASE_URL: string = API_BASE_URL.replace(/\/api\/?$/, '');

// Error helper to extract meaningful messages from API responses
export const getErrorMessage = (error: any): string => {
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  if (error?.response?.data?.error) {
    const errorMsg = error.response.data.error;
    // Handle specific MongoDB errors
    if (typeof errorMsg === 'string' && errorMsg.includes('E11000 duplicate key')) {
      if (errorMsg.includes('sku')) {
        return 'SKU already exists. Please choose a different SKU.';
      }
      return 'This item already exists. Please use different values.';
    }
    return errorMsg;
  }
  if (error?.message) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 second timeout
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

// Response interceptor for centralized error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle network errors
    if (!error.response) {
      error.message = 'Network error. Please check your connection.';
    }
    // Handle timeout errors
    if (error.code === 'ECONNABORTED') {
      error.message = 'Request timeout. Please try again.';
    }
    return Promise.reject(error);
  }
);

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