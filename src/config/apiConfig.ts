export const USER_LOGIN = `/auth/login`;
export const USER_REGISTER = `/users`;
export const GET_USER_DATA = `/users`;
export const UPDATE_USER_ENDPOINT = (id: string) => `/users/${id}`;
export const USER_LOGOUT = "/auth/logout";
export const GET_ALL_USERS = "/users/all";
export const CHANGE_USER_ROLE = (id: string) => `/users/${id}/role`;
export const DELETE_USER = (id: string) => `/users/${id}`;
