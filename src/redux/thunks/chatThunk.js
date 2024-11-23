import { baseUrl, getRequest } from "@/utils/services/requestService";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";


export const getChatDetails = createAsyncThunk(
  'chat/getChatDetails',
  async ({chatId}, { rejectWithValue }) => {
    try {
      const response = await getRequest(`${baseUrl}/chats/details/${chatId}`);
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Đã xảy ra lỗi");
      return rejectWithValue(error.response?.data); 
    }
  }
);
