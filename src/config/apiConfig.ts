export const USER_LOGIN = `/auth/login`;
export const USER_REGISTER = `/users`;
export const GET_USER_DATA = `/users`;
export const UPDATE_USER_ENDPOINT = (id: string) => `/users/${id}`;
export const USER_LOGOUT = "/auth/logout";
export const GET_ALL_USERS = "/users/all";
export const CHANGE_USER_ROLE = (id: string) => `/users/${id}/role`;
export const DELETE_USER = (id: string) => `/users/${id}`;
export const GET_DELIVERIES = (id: string) => `/deliveries/${id}/by-driver-ongoing`;
export const GET_DELIVERIES_DELIVERED = (id: string) => `/deliveries/${id}/by-driver-delivered`;
export const GET_OFD_ORDERS = `/orders/out-for-delivery`;
export const UPDATE_OFD_ORDERS = (id: string) => `/orders/${id}/status`;
export const GET_RESTAURANTS = `/customer/restaurants`;
export const ADD_ORDER_ENDPOINT =`/deliveries`;
export const UPDATE_ORDER_STATUS_ENDPOINT =(id: string) => `/deliveries/${id}/status`;

