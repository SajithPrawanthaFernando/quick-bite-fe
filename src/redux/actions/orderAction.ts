import { AppDispatch } from "../store";
import {
  getOrderStart,
  getOrderSuccess,
  getOrderFailure
} from "../slices/orderSlice";
import { orderApi } from "@/lib/api";
import { GET_OFD_ORDERS,UPDATE_OFD_ORDERS } from "@/config/apiConfig";

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
      const message = error.response?.data?.message || "Status update failed";
      console.error("Update error:", message);
      throw message; // Re-throw for component handling
    }
  };

