import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  available: boolean;
}

interface Restaurant {
  id: string;
  name: string;
  description: string;
  cuisine: string[];
  address: string;
  image: string;
  rating: number;
  isOpen: boolean;
  menu: MenuItem[];
}

interface RestaurantState {
  restaurants: Restaurant[];
  selectedRestaurant: Restaurant | null;
  loading: boolean;
  error: string | null;
}

const initialState: RestaurantState = {
  restaurants: [],
  selectedRestaurant: null,
  loading: false,
  error: null,
};

const restaurantSlice = createSlice({
  name: 'restaurant',
  initialState,
  reducers: {
    setRestaurants: (state, action: PayloadAction<Restaurant[]>) => {
      state.restaurants = action.payload;
    },
    setSelectedRestaurant: (state, action: PayloadAction<Restaurant>) => {
      state.selectedRestaurant = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    updateMenuItem: (state, action: PayloadAction<MenuItem>) => {
      if (state.selectedRestaurant) {
        const index = state.selectedRestaurant.menu.findIndex(
          (item) => item.id === action.payload.id
        );
        if (index !== -1) {
          state.selectedRestaurant.menu[index] = action.payload;
        }
      }
    },
  },
});

export const {
  setRestaurants,
  setSelectedRestaurant,
  setLoading,
  setError,
  updateMenuItem,
} = restaurantSlice.actions;
export default restaurantSlice.reducer; 