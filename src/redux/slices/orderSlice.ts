import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface DeliveryAddress {
  houseNumber: string;
  lane1: string;
  lane2?: string;
  city: string;
  district: string;
}

interface OrderItem {
  itemId: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  _id: string;
  orderId: string,
  customerId: string;
  restuarantId: string;
  items: OrderItem[];
  deliveryAddress: DeliveryAddress;
  deliveryFee: number;
  status: string;
  paymentStatus: string;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}

interface OrdersState {
  orders: Order[];
  loading: boolean;
  error: string | null;
}

const initialState: OrdersState = {
  orders: [],
  loading: false,
  error: null,
};

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    getOrderStart(state) {
      state.loading = true;
      state.error = null;
    },
    getOrderSuccess(state, action: PayloadAction<Order[]>) {
      state.loading = false;
      state.orders = action.payload;
    },
    getOrderFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    updateOrderStatus: (
      state, 
      action: PayloadAction<{ orderId: string; status: string }>
    ) => {
      const order = state.orders.find(o => o.orderId === action.payload.orderId);
      if (order) {
        order.status = action.payload.status;
      }
    }
  },
});

export const { getOrderStart, getOrderSuccess, getOrderFailure } = ordersSlice.actions;

export default ordersSlice.reducer;
