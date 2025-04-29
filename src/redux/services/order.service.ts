import { apiService } from './api.service';

export interface Order {
  id: string;
  restaurantId: string;
  status: string;
  // Add other order properties
}

export const orderService = {
  getOrders: () => 
    apiService.get<Order[]>('/orders'),
  
  getRestaurantOrders: (restaurantId: string) => 
    apiService.get<Order[]>(`/orders/restaurant/${restaurantId}`),
  
  getOrderById: (id: string) => 
    apiService.get<Order>(`/orders/${id}`),
  
  updateOrderStatus: (id: string, status: string) => 
    apiService.patch<Order>(`/orders/${id}/status`, { status }),
}; 