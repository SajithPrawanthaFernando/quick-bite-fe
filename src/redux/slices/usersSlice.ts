import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  _id: string;
  email: string;
  phone: string;
  address?: string;
  roles: string[];
  firstname?: string;
  lastname?: string;
  fullname?: string;
}

interface UsersState {
  users: User[];
  currentUser: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: UsersState = {
  users: [],
  currentUser: null,
  loading: false,
  error: null,
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    getUsersStart(state) {
      state.loading = true;
      state.error = null;
    },
    getUsersSuccess(state, action: PayloadAction<User[]>) {
      state.loading = false;
      state.users = action.payload;
    },
    getUsersFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },

    getCurrentUserStart(state) {
      state.loading = true;
      state.error = null;
    },
    getCurrentUserSuccess(state, action: PayloadAction<User>) {
      state.loading = false;
      state.currentUser = action.payload;
    },
    getCurrentUserFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },

    updateUserStart(state) {
      state.loading = true;
      state.error = null;
    },
    updateUserSuccess(state, action: PayloadAction<User>) {
      state.loading = false;
      const updatedUser = action.payload;
      const index = state.users.findIndex((u) => u._id === updatedUser._id);
      if (index !== -1) {
        state.users[index] = updatedUser;
      }

      if (state.currentUser?._id === updatedUser._id) {
        state.currentUser = updatedUser;
      }
    },
    updateUserFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    changeUserRoleStart(state) {
      state.loading = true;
      state.error = null;
    },
    changeUserRoleSuccess(state, action: PayloadAction<User>) {
      state.loading = false;
      const updatedUser = action.payload;
      const index = state.users.findIndex((u) => u._id === updatedUser._id);
      if (index !== -1) {
        state.users[index] = updatedUser;
      }
    },
    changeUserRoleFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    deleteUserStart(state) {
      state.loading = true;
      state.error = null;
    },
    deleteUserSuccess(state, action: PayloadAction<string>) {
      state.loading = false;
      state.users = state.users.filter((user) => user._id !== action.payload);
    },
    deleteUserFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  getUsersStart,
  getUsersSuccess,
  getUsersFailure,

  getCurrentUserStart,
  getCurrentUserSuccess,
  getCurrentUserFailure,

  updateUserStart,
  updateUserSuccess,
  updateUserFailure,

  changeUserRoleStart,
  changeUserRoleSuccess,
  changeUserRoleFailure,

  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
} = usersSlice.actions;

export default usersSlice.reducer;
