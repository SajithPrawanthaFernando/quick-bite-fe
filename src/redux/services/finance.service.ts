import { apiService } from './api.service';

export interface FinancialReport {
  // Add financial report properties
}

export interface Transaction {
  id: string;
  amount: number;
  // Add other transaction properties
}

export const financeService = {
  getRestaurantReport: (restaurantId: string) => 
    apiService.get<FinancialReport>(`/finance/restaurant/${restaurantId}/report`),
  
  requestPayout: (restaurantId: string) => 
    apiService.post<void>(`/finance/restaurant/${restaurantId}/payout`, {}),
  
  completePayout: (payoutId: string) => 
    apiService.post<void>(`/finance/payout/${payoutId}/complete`, {}),
  
  getRestaurantTransactions: (restaurantId: string) => 
    apiService.get<Transaction[]>(`/finance/restaurant/${restaurantId}/transactions`),
}; 