"use client";
import { baseUrl, postRequest } from "@/utils/services/requestService";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import Cookies from 'js-cookie';

export const registerUser = createAsyncThunk(
  "register/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await postRequest(`${baseUrl}/users/register`, userData);
      Cookies.set('token', response.data.token, { expires: 1 });
      return response.data;
    } catch (error) {
      toast.error(`Failed to register: ${error.message}`);
      return rejectWithValue(error.message);
    }
  }
);

export const login = createAsyncThunk(
  "login/login",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await postRequest(`${baseUrl}/users/login`, userData);
      Cookies.set('token', response.data.token, { expires: 1 });
      return response.data;
    } catch (error) {
      toast.error(`Failed to login: ${error.message}`);
      return rejectWithValue(error.message);
    }
  }
);

export const refreshToken = createAsyncThunk(
  "auth/refreshToken",
  async (_, { rejectWithValue }) => {
    try {
      const response = await postRequest(`${baseUrl}/users/refreshToken`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
