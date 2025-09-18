import { createAsyncThunk } from "@reduxjs/toolkit";
import { logout } from "./authSlice";
import { toast } from "react-toastify";
import { resetState } from "../reset";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Login Thunk
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (
    credentials: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
        credentials: "include", // Include cookies in the request
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || "Something went wrong");
      }

      const data = await response.json();
      toast.success(data.message);
      return data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unexpected error occurred");
    }
  }
);

// Logout Thunk
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/auth/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Include cookies for session management
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || "Something went wrong");
      }

      const data = await response.json();
      toast.success(data.message);

      // Dispatch the resetState action to reset Redux store
      dispatch(resetState());
      // Dispatch the logout action to reset Redux state
      dispatch(logout());
      return data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unexpected error occurred");
    }
  }
);

// Refresh Token Thunk
export const refreshAccessToken = createAsyncThunk(
  "auth/refreshAccessToken",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Include cookies for session management
      });

      if (!response.ok) {
        const errorData = await response.json();
        dispatch(logout());
        return rejectWithValue(errorData.message || "Failed to refresh token");
      }

      const data = await response.json();
      // No need to update Redux state for access token
      return data;
    } catch (error: unknown) {
      dispatch(logout());
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unexpected error occurred");
    }
  }
);

// Signup Thunk
export const signupUser = createAsyncThunk(
  "auth/signupUser",
  async (
    credentials: { name: string; email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch(`${BASE_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
        credentials: "include", // Include cookies for session management
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || "Signup failed");
      }

      const data = await response.json();
      toast.success(data.message);
      return data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unexpected error occurred");
    }
  }
);
