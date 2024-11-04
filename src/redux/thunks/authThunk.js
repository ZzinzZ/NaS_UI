"use client";
import { baseUrl, postRequest } from "@/utils/services/requestService";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { resetProfile } from "../slices/profileSlice";
import axios from "axios";

export const registerUser = createAsyncThunk(
  "signup/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await postRequest(`${baseUrl}/users/register`, userData);
      return response.data;
    } catch (error) {
      toast.error(error.response.data.message);
      return rejectWithValue(error.message);
    }
  }
);

export const login = createAsyncThunk(
  "login/login",
  async (userData, { rejectWithValue, dispatch }) => {
    try {
      const response = await postRequest(`${baseUrl}/users/login`, userData);
      const expires = new Date(new Date().getTime() + 30 * 1000);
      const { token, refreshToken } = response.data;
      Cookies.set("token", token, { expires });
      Cookies.set("refreshToken", refreshToken, { expires: 365 });
      Cookies.set("tokenExpiry", expires.getTime(), { expires });
      dispatch(resetProfile());
      toast.info(response.message);
      return response.data;
    } catch (error) {
      toast.error(error.response.data.message);
      return rejectWithValue(error.message);
    }
  }
);

export const refreshToken = createAsyncThunk(
  "auth/refreshToken",
  async (_, { rejectWithValue }) => {
    try {
      const refresh = Cookies.get("refreshToken");
      if (!refresh) {
        throw new Error("No refresh token available");
      }

      const response = await axios.post(`${baseUrl}/users/refreshToken`, {
        refreshToken: refresh,
      });
      
      const { token, refreshToken: newRefreshToken } = response.data.data;
      const expires = new Date(new Date().getTime() + 30 * 1000);
      Cookies.set("token", token, { expires });
      Cookies.set("refreshToken", newRefreshToken, { expires: 365 });
      Cookies.set("tokenExpiry", expires.getTime(), { expires });

      return response.data;
    } catch (error) {
      console.error("Error refreshing token", error);
      return rejectWithValue(error.message);
    }
  }
);
