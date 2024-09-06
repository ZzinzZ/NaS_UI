"use client";
import { createSlice } from "@reduxjs/toolkit";
import Cookies from 'js-cookie';
import { registerUser, login, refreshToken } from "../thunks/authThunk";
import { resetProfile } from "./profileSlice";

const AuthSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    error: null,
    loading: false,
    token: Cookies.get('token') || null
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.error = null;
      state.loading = false;
      state.token = null;
      console.log("remove token and logout");
      
      Cookies.remove('token'); 
      Cookies.remove('refreshToken'); 
      resetProfile();
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
  },
  extraReducers: (builder) => { 
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user || null;
        state.token = action.payload.token || null;
        resetProfile();
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.token = action.payload.data.token;
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.error = action.payload;
        console.log("refresh error:",action.payload);
      });
  }
});

export const { logout, setToken } = AuthSlice.actions;
export default AuthSlice.reducer;
