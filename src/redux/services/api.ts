import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for API calls
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Handle token refresh here if needed
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      // Add token refresh logic here
    }
    
    return Promise.reject(error);
  }
);

export const restaurantApi = {
  getAll: () => api.get('/restaurants'),
  getById: (id: string) => api.get(`/restaurants/${id}`),
  create: (data: any) => api.post('/restaurants', data),
  update: (id: string, data: any) => api.put(`/restaurants/${id}`, data),
  delete: (id: string) => api.delete(`/restaurants/${id}`),
};

export const menuApi = {
  getByRestaurant: (restaurantId: string) => api.get(`/restaurants/${restaurantId}/menu`),
  createItem: (restaurantId: string, data: any) => api.post(`/restaurants/${restaurantId}/menu`, data),
  updateItem: (restaurantId: string, itemId: string, data: any) => 
    api.put(`/restaurants/${restaurantId}/menu/${itemId}`, data),
  deleteItem: (restaurantId: string, itemId: string) => 
    api.delete(`/restaurants/${restaurantId}/menu/${itemId}`),
};

export const authApi = {
  login: (data: { email: string; password: string }) => api.post('/auth/login', data),
  register: (data: any) => api.post('/auth/register', data),
  logout: () => api.post('/auth/logout'),
  refreshToken: () => api.post('/auth/refresh-token'),
};

export const orderApi = {
  create: (data: any) => api.post('/orders', data),
  getByUser: () => api.get('/orders/user'),
  getByRestaurant: () => api.get('/orders/restaurant'),
  updateStatus: (orderId: string, status: string) => 
    api.put(`/orders/${orderId}/status`, { status }),
};

export default api; 