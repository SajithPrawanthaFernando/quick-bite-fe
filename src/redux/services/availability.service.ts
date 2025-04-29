import { apiService } from './api.service';

export interface Availability {
  // Add availability properties
}

export interface SpecialDay {
  date: string;
  // Add special day properties
}

export const availabilityService = {
  getRestaurantAvailability: (restaurantId: string) => 
    apiService.get<Availability>(`/availability/restaurant/${restaurantId}`),
  
  updateRestaurantAvailability: (restaurantId: string, data: Availability) => 
    apiService.put<Availability>(`/availability/restaurant/${restaurantId}`, data),
  
  addSpecialDay: (restaurantId: string, data: SpecialDay) => 
    apiService.post<void>(`/availability/special-day/${restaurantId}`, data),
  
  removeSpecialDay: (restaurantId: string, date: string) => 
    apiService.delete<void>(`/availability/special-day/${restaurantId}/${date}`),
  
  getCurrentStatus: (restaurantId: string) => 
    apiService.get<{ isOpen: boolean }>(`/availability/current-status/${restaurantId}`),
}; 