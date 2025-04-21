import { authApi } from "@/lib/api";
import {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  signupStart,
  signupSuccess,
  signupFailure,
} from "../slices/authSlice";

import { AppDispatch } from "../store";
import { USER_LOGIN, USER_LOGOUT, USER_REGISTER } from "@/config/apiConfig";

export const loginUser =
  (email: string, password: string) => async (dispatch: AppDispatch) => {
    dispatch(loginStart());
    try {
      const response = await authApi.post(USER_LOGIN, { email, password });
      const { token, user } = response.data;

      dispatch(loginSuccess({ token, user }));

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
    } catch (error: any) {
      dispatch(loginFailure(error?.response?.data?.message || "Login failed"));
    }
  };

export const signupUser =
  (userData: {
    email: string;
    password: string;
    phone?: string;
    address?: string;
    fullname?: string;
    firstname?: string;
    lastname?: string;
    roles?: string[];
  }) =>
  async (dispatch: AppDispatch) => {
    dispatch(signupStart());
    try {
      console.log(userData);
      const response = await authApi.post(USER_REGISTER, userData);
      dispatch(signupSuccess(response.data));
      console.log(userData);
      console.log(response.data);
    } catch (error: any) {
      dispatch(
        signupFailure(error?.response?.data?.message || "Registration failed")
      );
    }
  };

export const logoutUser = () => async (dispatch: AppDispatch) => {
  try {
    await authApi.post(USER_LOGOUT);
  } catch (err) {
    console.warn("Backend logout failed, proceeding to clear state anyway.");
  }

  localStorage.removeItem("token");
  localStorage.removeItem("user");
  dispatch(logout());
};
