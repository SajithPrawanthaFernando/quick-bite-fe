import { AppDispatch } from "../store";
import {
  getDeliveriesStart,
  getDeliveriesSuccess,
  getDeliveriesFailure,
} from "../slices/deliverySlice";
import { deliveryApi } from "@/lib/api";
import { GET_DELIVERIES } from "@/config/apiConfig";

export const getOrders = (id: string) => async (dispatch: AppDispatch) => {
  dispatch(getDeliveriesStart());
  try {
    const res = await deliveryApi.get(GET_DELIVERIES(id), {
      withCredentials: true,
    });
    dispatch(getDeliveriesSuccess([res.data]));
  } catch (err: any) {
    dispatch(
      getDeliveriesFailure(
        err?.response?.data?.message || "Failed to fetch deliveries"
      )
    );
  }
};
