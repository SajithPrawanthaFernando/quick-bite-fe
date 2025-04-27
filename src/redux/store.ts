// redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import usersReducer from "./slices/usersSlice";
import deiveriesReducer from "./slices/deliverySlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: usersReducer,
    delivery: deiveriesReducer,
  },
});

export type useAppDispatch = typeof store.dispatch;
export type useAppState = ReturnType<typeof store.getState>;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
