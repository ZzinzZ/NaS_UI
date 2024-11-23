"use client";
import { createSlice } from "@reduxjs/toolkit";
import { getChatDetails } from "../thunks/chatThunk";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    chatData: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getChatDetails.fulfilled, (state, action) => {
      state.chatData = action.payload.chat;
    });
  },
});

export const {} = chatSlice.actions;
export default chatSlice.reducer;
