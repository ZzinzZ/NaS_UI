"use client";
import { registerUser } from "../thunks/authThunk";
import { createSlice } from "@reduxjs/toolkit";

const RegisterSlice = createSlice({
  name: "register",
  initialState: {
    isLoading: false,
    success: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
        state.success = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

export default RegisterSlice.reducer;
