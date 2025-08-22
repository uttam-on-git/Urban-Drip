import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  isEmailVerified: boolean;
  phone: string | null;
  address: string | null;
  avatarUrl: string | null;
}

interface AuthState {
  auth: User | null;
}

// define the initial state
const initialState: AuthState = {
  auth: null,
};

export const authReducer = createSlice({
  name: 'authStore',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<User>) => {
      state.auth = action.payload;
    },
    logout: (state) => {
      state.auth = null;
    },
  },
});

export const { login, logout } = authReducer.actions;

export default authReducer.reducer;