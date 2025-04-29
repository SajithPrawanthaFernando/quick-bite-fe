import { AppDispatch } from "../store";
import {
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
  getOngoingOrdersStart,
  getOngoingOrdersSuccess,
  getOngoingOrdersFailure,
} from "../slices/deliverySlice";
import { deliveryApi } from "@/lib/api";
import {
  GET_DELIVERIES,
  ADD_ORDER_ENDPOINT,
  UPDATE_ORDER_STATUS_ENDPOINT,
  GET_DELIVERIES_DELIVERED,
  GET_USER_ONGOING,
} from "@/config/apiConfig";

export const getOrders = (id: string) => async (dispatch: AppDispatch) => {
  dispatch(getDeliveriesStart());
  try {
    const res = await deliveryApi.get(GET_DELIVERIES(id), {
      withCredentials: true,
    });
    dispatch(getDeliveriesSuccess(res.data));
    console.log(res);
  } catch (err: any) {
    dispatch(
      getDeliveriesFailure(
        err?.response?.data?.message || "Failed to fetch deliveries"
      )
    );
  }
};
export const getUserOrders = (id: string) => async (dispatch: AppDispatch) => {
  dispatch(getOngoingOrdersStart());
  try {
    const res = await deliveryApi.get(GET_USER_ONGOING(id), {
      withCredentials: true,
    });
    dispatch(getOngoingOrdersSuccess(res.data));
  } catch (err: any) {
    dispatch(
      getOngoingOrdersFailure(
        err?.response?.data?.message || "Failed to fetch deliveries"
      )
    );
  }
};
export const getDeliveredOrders =
  (id: string) => async (dispatch: AppDispatch) => {
    dispatch(getDeliveriesDeliveredStart());
    try {
      const res = await deliveryApi.get(GET_DELIVERIES_DELIVERED(id), {
        withCredentials: true,
      });
      dispatch(getDeliveriesDeliveredSuccess(res.data));
    } catch (err: any) {
      dispatch(
        getDeliveriesDeliveredFailure(
          err?.response?.data?.message || "Failed to fetch deliveries"
        )
      );
    }
  };

export const addDeliveryOrder =
  (orderData: any) => async (dispatch: AppDispatch) => {
    dispatch(addOrderStart());
    try {
      const res = await deliveryApi.post(ADD_ORDER_ENDPOINT, orderData, {
        withCredentials: true,
      });

      dispatch(addOrderSuccess(res.data));
    } catch (err: unknown) {
      let errorMessage = "Failed to add delivery order";
      if (typeof err === "object" && err !== null && "response" in err) {
        const axiosError = err as {
          response?: { data?: { message?: string } };
        };
        errorMessage = axiosError.response?.data?.message || errorMessage;
      }
      dispatch(getOrderFailure(errorMessage));
    }
  };

export const changeOrderStatus =
  (orderId: string, newStatus: "picked" | "in_transit" | "delivered") =>
  async (dispatch: AppDispatch) => {
    try {
      await deliveryApi.patch(
        UPDATE_ORDER_STATUS_ENDPOINT(orderId),
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
