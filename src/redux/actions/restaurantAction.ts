import { AppDispatch } from "../store";
import {
  getRestaurantsStart,
  getRestaurantsSuccess,
  getRestaurantsFailure
} from "../slices/restaurantSlice"; // Updated import path
import { restaurantApi } from "@/lib/api"; // Changed from orderApi to restaurantApi
import { GET_RESTAURANTS } from "@/config/apiConfig"; // Updated endpoint constant

export const fetchRestaurants = () => async (dispatch: AppDispatch) => {
  dispatch(getRestaurantsStart());
  try {
    const res = await restaurantApi.get(GET_RESTAURANTS, {
      withCredentials: true,
    });

    dispatch(getRestaurantsSuccess(res.data)); 

  } catch (err: any) {
    dispatch(
      getRestaurantsFailure(
        err?.response?.data?.message || "Failed to fetch restaurants"
      )
    );
  }
};