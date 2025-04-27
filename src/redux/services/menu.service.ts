import { apiService } from './api.service';

export interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  category?: string;
  isAvailable: boolean;
  restaurantId: string;
  liked:number;
  likeCount:number;
}

export const menuService = {
  getRestaurantMenu: (restaurantId: string) => 
    apiService.get<MenuItem[]>(`/menu/restaurant/${restaurantId}`),
  
  getMenus: () => 
    apiService.get<MenuItem[]>('/menu'),
  
  getMenuById: (id: string) => 
    apiService.get<MenuItem>(`/menu/${id}`),
  
  createMenuItem: (data: Partial<MenuItem>) => 
    apiService.post<MenuItem>('/menu', data),
  
  updateMenuItem: (id: string, data: Partial<MenuItem>) => 
    apiService.put<MenuItem>(`/menu/${id}`, data),
  
  deleteMenuItem: (id: string) => 
    apiService.delete<void>(`/menu/${id}`),
  
  updateMenuItemAvailability: (id: string, available: boolean) => 
    apiService.put<MenuItem>(`/menu/${id}/availability`, { available }),
}; 