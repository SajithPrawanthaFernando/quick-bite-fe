// redux/actions/cartActions.ts
import { AppDispatch } from "../store";
import { orderApi } from "@/lib/api"; // Your backend Axios connection
import {
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
} from "../slices/cartSlice";

const customerId = "680ca51fa95a4a19afc4bd0d"; // Later you can get from auth.

export const fetchCart = () => async (dispatch: AppDispatch) => {
  dispatch(fetchCartStart());
  try {
    const res = await orderApi.get(`/cart/${customerId}`);
    console.log(res);
    dispatch(fetchCartSuccess(res.data.items)); // backend sends { items: [...] }
  } catch (err: any) {
    dispatch(
      fetchCartFailure(err?.response?.data?.message || "Failed to fetch cart")
    );
  }
};

export const addToCart = (item: any) => async (dispatch: AppDispatch) => {
  dispatch(addToCartStart());
  try {
    const res = await orderApi.post(`/cart/${customerId}/add`, item);
    dispatch(addToCartSuccess(item)); // you can modify if needed
  } catch (err: any) {
    dispatch(
      addToCartFailure(err?.response?.data?.message || "Failed to add item")
    );
  }
};

export const updateCartItemQuantity =
  (itemId: string, quantity: number) => async (dispatch: AppDispatch) => {
    dispatch(updateQuantityStart());
    try {
      await orderApi.put(`/cart/${customerId}/item/${itemId}`, { quantity });
      dispatch(updateQuantitySuccess({ itemId, quantity }));
    } catch (err: any) {
      dispatch(
        updateQuantityFailure(
          err?.response?.data?.message || "Failed to update quantity"
        )
      );
    }
  };

export const removeCartItem =
  (itemId: string) => async (dispatch: AppDispatch) => {
    dispatch(removeItemStart());
    try {
      await orderApi.delete(`/cart/${customerId}/item/${itemId}`);
      dispatch(removeItemSuccess(itemId));
    } catch (err: any) {
      dispatch(
        removeItemFailure(
          err?.response?.data?.message || "Failed to remove item"
        )
      );
    }
  };

export const clearCart = () => async (dispatch: AppDispatch) => {
  dispatch(clearCartStart());
  try {
    await orderApi.delete(`/cart/${customerId}/clear`);
    dispatch(clearCartSuccess());
  } catch (err: any) {
    dispatch(
      clearCartFailure(err?.response?.data?.message || "Failed to clear cart")
    );
  }
};
