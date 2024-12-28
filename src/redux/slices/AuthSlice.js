"use client";
import { createSlice } from "@reduxjs/toolkit";
import Cookies from 'js-cookie';
import { registerUser, refreshToken } from "../thunks/authThunk";
import { resetProfile } from "./profileSlice";


const AuthSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    error: null,
    loading: false,
    token: Cookies.get('token') || null,
    stringeeToken: Cookies.get('stringeeToken') || null
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.error = null;
      state.loading = false;
      state.token = null;
      state.stringeeToken = null;
      Cookies.remove('token'); 
      Cookies.remove('refreshToken'); 
      Cookies.remove('stringeeToken');
      resetProfile();
    },
    loginState: (state, action) => {
      state.loading = false;
      state.user = action.payload.user || null;
      state.token = action.payload.token || null;
      state.stringeeToken = action.payload.stringeeToken || null;
      resetProfile();
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
  },

  // extraReducers: (builder) => { 
  //   builder
  //     .addCase(registerUser?.fulfilled, (state, action) => {
  //       state.user = action.payload.user;
  //       state.token = action.payload.token;
  //     })
  //     .addCase(refreshToken?.fulfilled, (state, action) => {
  //       state.token = action.payload.data.token;
  //     })
  //     .addCase(refreshToken?.rejected, (state, action) => {
  //       state.error = action.payload;
  //       console.log("refresh error:",action.payload);
  //     });
  // }

});

export const { logout, setToken,loginState } = AuthSlice.actions;
export default AuthSlice.reducer;
