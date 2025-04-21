import { AppDispatch } from "../store";
import {
  getUsersStart,
  getUsersSuccess,
  getUsersFailure,
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  changeUserRoleStart,
  changeUserRoleSuccess,
  changeUserRoleFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
} from "../slices/usersSlice";
import { authApi } from "@/lib/api";
import {
  CHANGE_USER_ROLE,
  DELETE_USER,
  GET_ALL_USERS,
  GET_USER_DATA,
  UPDATE_USER_ENDPOINT,
} from "@/config/apiConfig";
import User from "../slices/usersSlice";

export const getUsers = () => async (dispatch: AppDispatch) => {
  dispatch(getUsersStart());
  try {
    const res = await authApi.get(GET_USER_DATA);
    dispatch(getUsersSuccess([res.data]));
    console.log(res);
  } catch (err: any) {
    dispatch(
      getUsersFailure(err?.response?.data?.message || "Failed to fetch users")
    );
  }
};

export const updateUser =
  (id: string, updatedData: Partial<typeof User>) =>
  async (dispatch: AppDispatch) => {
    dispatch(updateUserStart());
    try {
      const res = await authApi.put(`/users/${id}`, updatedData);
      dispatch(updateUserSuccess(res.data));
    } catch (err: any) {
      dispatch(
        updateUserFailure(
          err?.response?.data?.message || "Failed to update user"
        )
      );
    }
  };

export const getAllUsers = () => async (dispatch: AppDispatch) => {
  dispatch(getUsersStart());
  try {
    const res = await authApi.get(GET_ALL_USERS);
    dispatch(getUsersSuccess(res.data));
  } catch (err: any) {
    dispatch(
      getUsersFailure(err?.response?.data?.message || "Failed to fetch users")
    );
  }
};

export const changeUserRole =
  (id: string, role: string) => async (dispatch: AppDispatch) => {
    dispatch(changeUserRoleStart());
    try {
      const res = await authApi.put(CHANGE_USER_ROLE(id), { role });
      dispatch(changeUserRoleSuccess(res.data));
    } catch (err: any) {
      dispatch(
        changeUserRoleFailure(
          err?.response?.data?.message || "Failed to update user role"
        )
      );
    }
  };

export const deleteUser = (id: string) => async (dispatch: AppDispatch) => {
  dispatch(deleteUserStart());
  try {
    await authApi.delete(DELETE_USER(id));
    dispatch(deleteUserSuccess(id));
  } catch (err: any) {
    dispatch(
      deleteUserFailure(err?.response?.data?.message || "Failed to delete user")
    );
  }
};
