"use client"
import { createSlice } from "@reduxjs/toolkit";
import { commentPost, getPostDetails, getUserArticlePosts, reactPost, replyCommentPost } from "../thunks/postThunk";

const initialState = {
  posts: [],
  post: null,
};

const postSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setPosts: (state, action) => {
      state.posts = action.payload;
    },
    addPost: (state, action) => {
      state.posts.unshift(action.payload);
    },
    deletePost: (state, action) => {
      state.posts = state.posts.filter((post) => post.id !== action.payload);
    },
  },
  // extraReducers: (builder) => {
  //   builder
  //     .addCase(getUserArticlePosts.fulfilled, (state, action) => {
  //       console.log("list post", action.payload);
  //     })
  // }
});

export const { setPosts, addPost, deletePost } = postSlice.actions;

export default postSlice.reducer;
