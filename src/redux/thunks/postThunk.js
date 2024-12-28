import {
  baseUrl,
  getRequest,
  postRequest,
  putRequest,
} from "@/utils/services/requestService";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

export const createArticlePost = createAsyncThunk(
  "posts/createArticlePost",
  async (postData, { rejectWithValue }) => {
    try {
      const response = await postRequest(`${baseUrl}/posts/article`, postData);
      return response.data;
    } catch (error) {
      toast.error(error.response.data.message);
      rejectWithValue(error.response.data);
    }
  }
);

export const getUserArticlePosts = createAsyncThunk(
  "posts/getArticlePost",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await getRequest(`${baseUrl}/posts/article/${userId}`);
      return response.data;
    } catch (error) {
      rejectWithValue(error.response.data);
    }
  }
);

export const getPostDetails = createAsyncThunk(
  "posts/getDetails",
  async (postId, { rejectWithValue }) => {
    try {
      const response = await getRequest(`${baseUrl}/posts/detail/${postId}`);
      return response.data;
    } catch (error) {
      rejectWithValue(error.response.data);
    }
  }
);

export const reactPost = createAsyncThunk(
  "posts/reactPost",
  async ({ postId, userId, emotion }, { rejectWithValue }) => {
    try {
      const response = await putRequest(`${baseUrl}/posts/react/${postId}`, {
        userId,
        emotion,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const reactComment = createAsyncThunk(
  "post/reactComment",
  async ({ commentId, postId, userId, emotion }, { rejectWithValue }) => {
    try {
      const response = await putRequest(
        `${baseUrl}/posts/comments/react/${postId}`,
        { commentId, userId, emotion }
      );
      return response.data;
    } catch (error) {
      rejectWithValue(error.response.data);
    }
  }
);

export const reactReplyComment = createAsyncThunk(
  "post/reactReplyComment",
  async ({ commentId, postId, userId, emotion,replyCommentId }, { rejectWithValue }) => {
    try {
      const response = await putRequest(
        `${baseUrl}/posts/comments/reply/react/${postId}`,
        { commentId, userId, emotion, replyCommentId }
      );
      return response.data;
    } catch (error) {
      rejectWithValue(error.response.data);
    }
  }
);

export const commentPost = createAsyncThunk(
  "post/addComment",
  async ({ postId, userId, content, image, gif }, { rejectWithValue }) => {
    try {

      const formData = new FormData();
      formData.append("userId", userId);
      if (content) {
        formData.append("content", content);
      }
      if (image) {
        formData.append("image", image);
      }
      if (gif) {
        formData.append("gif", gif);
      }
      const response = await postRequest(
        `${baseUrl}/posts/comments/${postId}`,
        formData
      );
      return response.data;
    } catch (error) {
      toast.error(error.response.data.message);
      rejectWithValue(error.response.data);
    }
  }
);

export const replyCommentPost = createAsyncThunk(
  "post/replyComment",
  async (
    { postId, userId, content, image, gif, replyToCommentId },
    { rejectWithValue }
  ) => {
    try {
      const formData = new FormData();
      formData.append("userId", userId);
      if (content) {
        formData.append("content", content);
      }
      if (image) {
        formData.append("image", image);
      }
      if (gif) {
        formData.append("gif", gif);
      }
      formData.append("replyToCommentId", replyToCommentId);
      const response = await postRequest(
        `${baseUrl}/posts/comments/${postId}`,
        formData
      );
      return response.data;
    } catch (error) {
      rejectWithValue(error.response.data);
    }
  }
);

export const getPostComment = createAsyncThunk(
  "post/getComment",
  async ({ postId }, { rejectWithValue }) => {
    try {
      const response = await getRequest(`${baseUrl}/posts/comments/sort-react/${postId}`);
      return response.data;
    } catch (error) {
      rejectWithValue(error.response.data);
    }
  }
)