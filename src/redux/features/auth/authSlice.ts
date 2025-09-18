import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { loginUser, logoutUser, refreshAccessToken } from "./authThunks";
import { User } from "@/types/auth/auth";
import { resetState } from "../reset";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

const initialAuthState: AuthState = {
  user: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialAuthState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(refreshAccessToken.fulfilled, () => {
        // No operation needed for refreshAccessToken
      })
      .addCase(resetState, () => initialAuthState);
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;
