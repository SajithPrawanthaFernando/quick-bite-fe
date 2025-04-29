import { apiService } from './api.service';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  isAvailable: boolean;
}

export interface OperatingHours {
  day: string;
  open: string;
  close: string;
  isOpen: boolean;
}

export interface Restaurant {
  _id: string;
  name: string;
  description: string;
  cuisineType: string;
  address: string;
  phone: string;
  logo?: string;
  rating?: number;
  isTemporarilyClosed: boolean;
  operatingHours: OperatingHours[];
  isApproved: boolean;
  isActive: boolean;
  location: {
    type: string;
    coordinates: number[];
  };
  owner?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface SpecialDay {
  date: string;
  isOpen: boolean;
  open?: string;
  close?: string;
  reason?: string;
}

export interface AvailabilitySettings {
  operatingHours: OperatingHours[];
  specialDays: SpecialDay[];
  isTemporarilyClosed: boolean;
  temporaryClosureReason?: string;
  temporaryClosureEndDate?: string;
}

export interface Order {
  // Define the structure of an order
}

export const restaurantService = {
  // Restaurant CRUD operations
  createRestaurant: (data: Partial<Restaurant>) => 
    apiService.post<Restaurant>('/restaurants', data),
  
  getRestaurants: () => 
    apiService.get<PaginatedResponse<Restaurant>>('/restaurants'),
  
  getRestaurantById: (id: string) => 
    apiService.get<Restaurant>(`/restaurants/${id}`),
  
  updateRestaurant: (id: string, data: Partial<Restaurant>) => 
    apiService.put<Restaurant>(`/restaurants/${id}`, data),
  
  deleteRestaurant: (id: string) => 
    apiService.delete<void>(`/restaurants/${id}`),
  
  // Restaurant management operations
  getPendingRestaurants: () => 
    apiService.get<PaginatedResponse<Restaurant>>('/restaurants/pending'),
  
  temporaryClosure: (id: string) => 
    apiService.patch<Restaurant>(`/restaurants/${id}/temporary-closure`, {}),
  
  approveRestaurant: (id: string) => 
    apiService.get<Restaurant>(`/restaurants/${id}/approve`),
  
  rejectRestaurant: (id: string) => 
    apiService.get<Restaurant>(`/restaurants/${id}/reject`),
  
  // Owner dashboard operations
  getOwnerDashboard: (restaurantId: string) => 
    apiService.get<any>(`/restaurants/owner/${restaurantId}/dashboard`),
  
  getOwnerOrders: (restaurantId: string) => 
    apiService.get<any[]>(`/restaurants/owner/${restaurantId}/orders`),
  
  getOwnerMenu: (restaurantId: string) => 
    apiService.get<MenuItem[]>(`/restaurants/owner/${restaurantId}/menu`),

  // Menu item operations
  createMenuItem: (data: Partial<MenuItem>) => 
    apiService.post<MenuItem>('/menu', data),
  
  updateMenuItem: (id: string, data: Partial<MenuItem>) => 
    apiService.put<MenuItem>(`/menu/${id}`, data),
  
  deleteMenuItem: (id: string) => 
    apiService.delete<void>(`/menu/${id}`),

  // Availability settings
  getAvailabilitySettings: () => 
    apiService.get<AvailabilitySettings>('/availability/restaurant/current'),
  
  updateAvailabilitySettings: (settings: AvailabilitySettings) => 
    apiService.put<AvailabilitySettings>('/availability/restaurant/current', settings),
  
  addSpecialDay: (specialDay: SpecialDay) => 
    apiService.post<SpecialDay>('/availability/special-day/current', specialDay),
  
  removeSpecialDay: (date: string) => 
    apiService.delete<void>(`/availability/special-day/current/${date}`),
  
  getCurrentStatus: () => 
    apiService.get<{ isOpen: boolean; nextOpenTime?: string }>('/availability/current-status/current'),

  getRestaurant: (id: string) => 
    apiService.get<Restaurant>(`/restaurants/${id}`),
  
  getRestaurantOrders: (id: string) => 
    apiService.get<Order[]>(`/restaurants/${id}/orders`),

  
}; 