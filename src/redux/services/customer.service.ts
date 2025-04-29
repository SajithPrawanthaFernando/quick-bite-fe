import { apiService } from './api.service';
import { Restaurant, PaginatedResponse } from './restaurant.service';
import { MenuItem } from './menu.service';

export const customerService = {
  getRestaurants: async (): Promise<Restaurant[]> => {
    try {
      const response = await apiService.get<PaginatedResponse<Restaurant>>('/customer/restaurants');
      return response.data; // This returns an array
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      throw error;
    }
  }
  ,
  
  getRestaurant: (id: string) => 
    apiService.get<Restaurant>(`/restaurants/${id}`),
  
  getRestaurantMenu: async (id: string) => {
    try {
      const response = await apiService.get(`/customer/restaurants/${id}/menu`);
      return response;
    } catch (error) {
      console.error('Error fetching restaurant menu:', error);
      throw error;
    }
  },
}; 