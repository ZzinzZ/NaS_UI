import {
  baseUrl,
  getRequest,
  postRequest,
  putRequest,
} from "@/utils/services/requestService";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

export const getProfile = createAsyncThunk(
  "profile/getProfile",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await getRequest(
        `${baseUrl}/profiles/find_by_userId/${userId}`
      );
      return response.data;
    } catch (error) {
      toast.error(error.response.data.message);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getListFriends = createAsyncThunk(
  "profile/getListFriends",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await getRequest(
        `${baseUrl}/profiles/friends/list/${userId}`
      );
      return response.data;
    } catch (error) {
      toast.error(error.response.data.message);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const sendFriendRequest = createAsyncThunk(
  "profile/sendFriendRequest",
  async ({ receptionId, senderId }, { rejectWithValue }) => {
    try {
      const response = await putRequest(
        `${baseUrl}/profiles/friends/friend_request/${receptionId}`,
        { senderId: senderId }
      );
      toast.info(response.message);
      return response.data;
    } catch (error) {
      toast.error(error.response.data.message);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const acceptFriendRequest = createAsyncThunk(
  "profile/acceptFriendRequest",
  async ({ receiverId, senderId }, { rejectWithValue }) => {
    try {
      const response = await putRequest(
        `${baseUrl}/profiles/friends/accept_friend_request/${receiverId}`,
        { senderId: senderId }
      );
      toast.info(response.message);
      return response.data;
    } catch (error) {
      toast.error(error.response.data.message);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const rejectFriendRequest = createAsyncThunk(
  "profile/rejectFriendRequest",
  async ({ receiverId, senderId }, { rejectWithValue }) => {
    try {
      const response = await putRequest(
        `${baseUrl}/profiles/friends/reject_friend_request/${receiverId}`,
        { senderId: senderId }
      );
      toast.info(response.message);
      return response.data;
    } catch (error) {
      toast.error(error.response.data.message);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const removeFriendRequest = createAsyncThunk(
  "profile/removeRequest",
  async ({ senderId, receiverId }, { rejectWithValue }) => {
    try {
      const response = await putRequest(
        `${baseUrl}/profiles/friends/remove_friend_request/${receiverId}`,
        { senderId: senderId }
      );
      toast.info(response.message);
      return response.data;
    } catch (error) {
      toast.error(error.response.data.message);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const unfriend = createAsyncThunk(
  "profile/unfriend",
  async ({ userId, friendId }, { rejectWithValue }) => {
    try {
      const response = await putRequest(
        `${baseUrl}/profiles/friends/unfriend/${userId}`,
        { friendId: friendId }
      );
      toast.info(response.message);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateAvatar = createAsyncThunk(
  "profile/updateAvatar",
  async ({ userId, avatarFile }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("avatar", avatarFile);
      formData.append("userId", userId);

      const response = await postRequest(
        `${baseUrl}/posts/avatar`,
        formData
      );
      if(response.status == "success") {
        return response.data;
      }
      else {
        toast.error(response.message);
      }
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateBackground = createAsyncThunk(
  "profile/updateBackground",
  async ({ userId, backgroundFile }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("background", backgroundFile);
      formData.append("userId", userId);

      const response = await postRequest(
        `${baseUrl}/posts/background`,
        formData
      );
      if(response.status == "success") {
        return response.data;
      }
      else {
        toast.error(response.message);
      }
      
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateBio= createAsyncThunk(
  "profile/updateBio",
  async ({ profileId, bio }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("bio", bio);

      const response = await putRequest(
        `${baseUrl}/profiles/update/${profileId}`,
        formData
      );
      if(response.status == "success") {
        return response.data;
      }
      else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Failed to update");
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);





