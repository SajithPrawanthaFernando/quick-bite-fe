export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  available: boolean;
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

export interface Order {
  id: string;
  restaurantId: string;
  customerId: string;
  items: {
    menuItemId: string;
    quantity: number;
    price: number;
  }[];
  status: 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  total: number;
  createdAt: string;
  updatedAt: string;
}

export interface RestaurantAnalytics {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  popularItems: {
    menuItemId: string;
    name: string;
    quantity: number;
    revenue: number;
  }[];
  ordersByStatus: {
    [key: string]: number;
  };
} 