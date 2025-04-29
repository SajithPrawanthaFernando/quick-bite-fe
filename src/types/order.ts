export interface Order {
  _id: string;
  customer: {
    _id: string;
    name: string;
    email: string;
  };
  restaurant: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  menuItemId: string;
  quantity: number;
  price: number;
  name: string;
} 