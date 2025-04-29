import { AppDispatch } from "../store";
import {
  getOrderStart,
  getOrderSuccess,
  getOrderFailure,
  fetchOrdersStart,
  fetchOrdersSuccess,
  fetchOrdersFailure,
  createOrderStart,
  createOrderSuccess,
  createOrderFailure,
  updateOrderStatusStart,
  updateOrderStatusSuccess,
  updateOrderStatusFailure,
} from "../slices/orderSlice";
import { orderApi } from "@/lib/api";
import { GET_OFD_ORDERS, UPDATE_OFD_ORDERS } from "@/config/apiConfig";
import { AxiosError } from "axios";

export const getDeliveryOrders = () => async (dispatch: AppDispatch) => {
  dispatch(getOrderStart());
  try {
    const res = await orderApi.get(GET_OFD_ORDERS, {
      withCredentials: true,
    });

    dispatch(getOrderSuccess(res.data));
  } catch (err: any) {
    dispatch(
      getOrderFailure(
        err?.response?.data?.message || "Failed to fetch deliveries"
      )
    );
  }
};
export const changeOrderStatus =
  (orderId: string, newStatus: "confirmed") =>
  async (dispatch: AppDispatch) => {
    try {
      await orderApi.put(
        UPDATE_OFD_ORDERS(orderId),
        { status: newStatus },
        { withCredentials: true }
      );
    } catch (err) {
      const error = err as AxiosError;
      const message = error.response?.data || "Status update failed";
      console.error("Update error:", message);
      throw message; // Re-throw for component handling
    }
  };

export const createOrder =
  (customerId: string, orderData: any) => async (dispatch: AppDispatch) => {
    dispatch(createOrderStart());
    try {
      const res = await orderApi.post(
        `/cart/${customerId}/checkout`,
        orderData
      );
      console.log(res);
      dispatch(createOrderSuccess(res.data));
    } catch (err: any) {
      dispatch(
        createOrderFailure(
          err?.response?.data?.message || "Failed to create order"
        )
      );
    }
  };

export const fetchOrders = () => async (dispatch: AppDispatch) => {
  dispatch(fetchOrdersStart());
  try {
    const res = await orderApi.get(
      `/orders/customer/680ca51fa95a4a19afc4bd0d/orders`
    );
    console.log(res);
    dispatch(fetchOrdersSuccess(res.data));
  } catch (err: any) {
    dispatch(
      fetchOrdersFailure(
        err?.response?.data?.message || "Failed to fetch orders"
      )
    );
  }
};

// Update order status (preparing / packing / out for delivery etc.)
export const updateOrderStatus =
  (orderId: string, status: string) => async (dispatch: AppDispatch) => {
    dispatch(updateOrderStatusStart());
    try {
      const res = await orderApi.put(`/order/${orderId}/status`, { status });
      dispatch(updateOrderStatusSuccess(res.data));
    } catch (err: any) {
      dispatch(
        updateOrderStatusFailure(
          err?.response?.data?.message || "Failed to update order status"
        )
      );
    }
  };
