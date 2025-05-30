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
