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
  loading: boolean;
  error: string | null;
}

const initialState: FoodOrdersState = {
  orders: [],
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
  },
});

export const {
  getDeliveriesStart,
  getDeliveriesSuccess,
  getDeliveriesFailure,
} = deliveriesSlice.actions;

export default deliveriesSlice.reducer;
