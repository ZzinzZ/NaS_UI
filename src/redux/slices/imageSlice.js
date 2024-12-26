"use client"
import { createSlice } from "@reduxjs/toolkit";

const imageSlice = createSlice({
  name: "image",
  initialState: {
    src: null,
    show: false,
  },
  reducers: {
    showImage: (state, action) => {
        state.src = action.payload;
        state.show = true;
    },
    hideImage: (state) => {
        state.src = null;
        state.show = false;
    }
  },
});

export const { showImage, hideImage } = imageSlice.actions;
export default imageSlice.reducer;
