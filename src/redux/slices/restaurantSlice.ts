import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Restaurant {
  _id: string;
  name: string;
  description: string;
  address: string;
  phone: string;
  logo: string;
  cuisineType: string;
  owner: string;
  isApproved: boolean;
  isActive: boolean;
  isTemporarilyClosed: boolean;
  verificationNotes: string;
  rejectionReason: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

interface ApiResponse {
  data: Restaurant[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

interface RestaurantsState {
  restaurants: Restaurant[];
  loading: boolean;
  error: string | null;
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

const initialState: RestaurantsState = {
  restaurants: [],
  loading: false,
  error: null,
};

const restaurantsSlice = createSlice({
  name: "restaurants",
  initialState,
  reducers: {
    getRestaurantsStart(state) {
      state.loading = true;
      state.error = null;
    },
    getRestaurantsSuccess(state, action: PayloadAction<ApiResponse>) {
      state.loading = false;
      state.restaurants = action.payload.data;
      state.meta = action.payload.meta;
    },
    getRestaurantsFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { 
  getRestaurantsStart, 
  getRestaurantsSuccess, 
  getRestaurantsFailure,
} = restaurantsSlice.actions;

export default restaurantsSlice.reducer;