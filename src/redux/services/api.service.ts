import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const fullUrl = `${config.baseURL || ''}${config.url || ''}`;
    console.log('Making request to:', fullUrl);
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor to log errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Response error:', error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

export const apiService = {
  get: <T>(url: string) => api.get<T>(url).then(response => response.data),
  
  post: <T>(url: string, data?: any) => 
    api.post<T>(url, data).then(response => response.data),
  
  put: <T>(url: string, data?: any) => 
    api.put<T>(url, data).then(response => response.data),
  
  patch: <T>(url: string, data?: any) => 
    api.patch<T>(url, data).then(response => response.data),
  
  delete: <T>(url: string) => 
    api.delete<T>(url).then(response => response.data),
}; 