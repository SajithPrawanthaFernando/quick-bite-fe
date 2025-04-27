import { apiService } from './api.service';
import { Restaurant } from '@/types/restaurant';
import { Order } from '@/types/order';

export interface User {
  id: string;
  email: string;
  name: string;
  role?: 'user' | 'restaurant_owner' | 'admin';
  isActive: boolean;
  // Add other user properties
}

export const adminService = {
  getUsers: async () => {
    // Make the API call
    const response = await apiService.get<{ data: User[] }>('/admin/users');
    
    // Return the 'data' field which contains the array of users
    return response.data;
  },
  
  suspendUser: (id: string) =>
    apiService.patch<void>(`/admin/users/${id}/suspend`, { suspended: true }),
  
  reactivateUser: (id: string) =>
    apiService.patch<void>(`/admin/users/${id}/reactivate`, { suspended: false }),

// admin.service.ts

  getPendingRestaurants: async () => {
    try {
      const result = await apiService.get<{ data: Restaurant[]; meta: any }>('/admin/restaurants?status=pending');
      console.log('Fetched result:', result);

      // Check if we have data in the response
      if (result && result.data) {
        return result.data;
      }
      
     
      
      // Return pending restaurants from all restaurants
    
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      return []; // Return empty array in case of error
    }
  },

  // Get all restaurants with optional status filter
  getAllRestaurants: async (status?: 'pending' | 'approved' | 'rejected') => {
    try {
      const url = status 
        ? `/admin/restaurants?status=${status}`
        : '/admin/restaurants';
      
      const result = await apiService.get<{ data: Restaurant[]; meta: any }>(url);
      console.log('Fetched restaurants:', result);

      if (result && result.data) {
        return result.data;
      }
      return [];
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      return [];
    }
  },

  // Get approved restaurants
  getApprovedRestaurants: async () => {
    try {
      const result = await apiService.get<{ data: Restaurant[]; meta: any }>('/admin/restaurants?status=approved');
      return result.data || [];
    } catch (error) {
      console.error('Error fetching approved restaurants:', error);
      return [];
    }
  },

  // Get rejected restaurants
  getRejectedRestaurants: async () => {
    try {
      const result = await apiService.get<{ data: Restaurant[]; meta: any }>('/admin/restaurants?status=rejected');
      return result.data || [];
    } catch (error) {
      console.error('Error fetching rejected restaurants:', error);
      return [];
    }
  },

  verifyRestaurant: async (id: string, data: { approved: boolean; notes?: string }) => {
    try {
      const response = await apiService.post<Restaurant>(`/admin/restaurants/${id}/verify`, {
        isApproved: data.approved,
        isActive: data.approved,
        verificationNotes: data.notes,
        verificationDate: new Date().toISOString(),
        status: data.approved ? 'approved' : 'rejected',
        verifiedAt: new Date().toISOString(),
        verificationStatus: data.approved ? 'approved' : 'rejected',
        lastStatusChange: new Date().toISOString()
      });
  
      if (!response) {
        throw new Error('No data received from server');
      }
  
      return response;
    } catch (error) {
      console.error('Error verifying restaurant:', error);
      throw error;
    }
  },
  
  
  updateRestaurantVerification: async (id: string, data: any) => {
    try {
      const response = await apiService.patch<Restaurant>(`/admin/restaurants/${id}/verification`, {
        isApproved: false,
        isActive: false,
        rejectionReason: data.rejectionReason,
        verificationDate: new Date().toISOString(),
        status: 'rejected'
      });
      
      if (!response) {
        throw new Error('No data received from server');
      }
      
      return response;
    } catch (error) {
      console.error('Error updating restaurant verification:', error);
      throw error;
    }
  },
  
  getTransactions: () => 
    apiService.get<any[]>('/admin/transactions'),
  
  processPayout: (restaurantId: string) => 
    apiService.post<void>(`/admin/restaurants/${restaurantId}/payout`, {}),
  
  getDisputes: () => 
    apiService.get<any[]>('/admin/disputes'),
  
  resolveDispute: (id: string) => 
    apiService.post<void>(`/admin/disputes/${id}/resolve`, {}),
  
  getFinancialReports: () => 
    apiService.get<any>('/admin/reports/financial'),

  getOrders: () => apiService.get<Order[]>('/admin/orders'),
};
