import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Location {
  address: string;
  latitude: number;
  longitude: number;
}

export interface FoodOrder {
  _id: string;
  orderId: string;
  customerId: string;
  driverId: string;
  driverName: string;
  pickupLocation: Location;
  deliveryLocation: Location;
  status: "picked" | "delivering" | "in_transit" | "delivered" | "cancelled";
  estimatedDeliveryTime: Date | null;
  actualDeliveryTime: Date | null;
  deliveryNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface FoodOrdersState {
  orders: FoodOrder[];
  delivered: FoodOrder[];
  loading: boolean;
  error: string | null;
}

const initialState: FoodOrdersState = {
  orders: [],
  delivered: [],
  loading: false,
  error: null,
};

const deliveriesSlice = createSlice({
  name: "deliveries",
  initialState,
  reducers: {
    getDeliveriesStart(state) {
      state.loading = true;
      state.error = null;
    },
    getDeliveriesSuccess(state, action: PayloadAction<FoodOrder[]>) {
      state.loading = false;
      state.orders = action.payload;
    },
    getDeliveriesFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    getDeliveriesDeliveredStart(state) {
      state.loading = true;
      state.error = null;
    },
    getDeliveriesDeliveredSuccess(state, action: PayloadAction<FoodOrder[]>) {
      state.loading = false;
      state.delivered = action.payload;
    },
    getDeliveriesDeliveredFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    addOrderStart(state) {
      state.loading = true;
      state.error = null;
    },
    addOrderSuccess(state, action: PayloadAction<FoodOrder[]>) {
      state.loading = false;
      state.orders = action.payload;
    },
    getOrderFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    updateOrderStatus: (state, action: PayloadAction<{
      orderId: string;
      status: "picked" | "in_transit" | "delivered";
    }>) => {
      const order = state.orders.find(o => o.orderId === action.payload.orderId);
      if (order) {
        order.status = action.payload.status;
      }
    }
  },
});

export const {
  getDeliveriesStart,
  getDeliveriesSuccess,
  getDeliveriesFailure,

  addOrderStart,
  addOrderSuccess,
  getOrderFailure,

  updateOrderStatus, 

  getDeliveriesDeliveredFailure,
  getDeliveriesDeliveredStart,
  getDeliveriesDeliveredSuccess,
} = deliveriesSlice.actions;

export default deliveriesSlice.reducer;
