// lib/api.ts
import axios from "axios";

const createAxiosInstance = (baseURL: string) =>
  axios.create({
    baseURL,
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });

export const authApi = createAxiosInstance(
  process.env.NEXT_PUBLIC_AUTH_SERVICE!
);
export const userApi = createAxiosInstance(
  process.env.NEXT_PUBLIC_USER_SERVICE!
);
export const orderApi = createAxiosInstance(
  process.env.NEXT_PUBLIC_ORDER_SERVICE!
);
export const deliveryApi = createAxiosInstance(
  process.env.NEXT_PUBLIC_DELIVERY_SERVICE!
);
export const restaurantApi = createAxiosInstance(
  process.env.NEXT_PUBLIC_RESTAURANT_SERVICE!
);
