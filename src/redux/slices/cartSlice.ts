// redux/slices/cartSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CartItem {
  itemId: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartState {
  cart: CartItem[];  
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  cart: [],
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    fetchCartStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchCartSuccess(state, action: PayloadAction<CartItem[]>) {
      state.loading = false;
      state.cart = action.payload;
    },
    fetchCartFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },

    addToCartStart(state) {
      state.loading = true;
      state.error = null;
    },
    addToCartSuccess(state, action: PayloadAction<CartItem>) {
      state.loading = false;
      state.cart.push(action.payload);
    },
    addToCartFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },

    updateQuantityStart(state) {
      state.loading = true;
      state.error = null;
    },
    updateQuantitySuccess(
      state,
      action: PayloadAction<{ itemId: string; quantity: number }>
    ) {
      state.loading = false;
      const { itemId, quantity } = action.payload;
      const item = state.cart.find((item) => item.itemId === itemId);
      if (item) {
        item.quantity = quantity;
      }
    },
    updateQuantityFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },

    removeItemStart(state) {
      state.loading = true;
      state.error = null;
    },
    removeItemSuccess(state, action: PayloadAction<string>) {
      state.loading = false;
      state.cart = state.cart.filter((item) => item.itemId !== action.payload);
    },
    removeItemFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },

    clearCartStart(state) {
      state.loading = true;
      state.error = null;
    },
    clearCartSuccess(state) {
      state.loading = false;
      state.cart = [];
    },
    clearCartFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchCartStart,
  fetchCartSuccess,
  fetchCartFailure,
  addToCartStart,
  addToCartSuccess,
  addToCartFailure,
  updateQuantityStart,
  updateQuantitySuccess,
  updateQuantityFailure,
  removeItemStart,
  removeItemSuccess,
  removeItemFailure,
  clearCartStart,
  clearCartSuccess,
  clearCartFailure,
} = cartSlice.actions;

export default cartSlice.reducer;
