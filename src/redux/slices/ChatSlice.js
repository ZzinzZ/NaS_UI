"use client";
import { createSlice } from "@reduxjs/toolkit";
import { getChatDetails } from "../thunks/chatThunk";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    chatData: null,
    isLoading: false,  // Thêm trạng thái isLoading
    error: null,       // Thêm trạng thái error
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getChatDetails.pending, (state) => {
        console.log("Loading chat...");
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getChatDetails.fulfilled, (state, action) => {
        console.log(action.payload);  
        state.chatData = action.payload.chat;
        state.isLoading = false; 
      })
      .addCase(getChatDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message; 
      });
  },
});

export const {} = chatSlice.actions;
export default chatSlice.reducer;
