import { createSlice } from "@reduxjs/toolkit";
import { acceptFriendRequest, getListFriends, getProfile, sendFriendRequest } from "../thunks/profileThunk";

const initialState= {
  profileData: {},
  otherProfileData: {},
  isLoading: false,
  error: null,
  listFriend: null,
};

const profileSlice = createSlice({
    name: "profile",
    initialState,
    reducers: {
      setProfileData(state, action) {
        state.profileData = action.payload;
      },
      getOtherProfileData(state, action) {
        state.otherProfileData = action.payload;
      },
      setLoading(state, action) {
        state.isLoading = action.payload;
      },
      setError(state, action) {
        state.error = action.payload;
      },
      resetProfile(state) {
        Object.assign(state, initialState);
      }
    },
    extraReducers: (builder) => {
      builder
        .addCase(getProfile.pending, (state) => {
          state.isLoading = true;
          state.error = null;
        })
        .addCase(getProfile.fulfilled, (state, action) => {
          state.isLoading = false;
          state.profileData = action.payload;
          
        })
        .addCase(getProfile.rejected, (state, action) => {
          state.isLoading = false;
          state.error = action.payload || action.error.message;
        })
        .addCase(getListFriends.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(getListFriends.fulfilled, (state, action) => {
          state.listFriend = action.payload;
          console.log("List friends:",action.payload);
          state.isLoading = false;
        })
        .addCase(getListFriends.rejected, (state, action) => {
          state.isLoading = false;
          state.error = action.payload || action.error.message;
        })
        .addCase(sendFriendRequest.pending, (state, action) => {
          state.isLoading = true;
        })
        .addCase(sendFriendRequest.fulfilled, (state, action) => {
          state.isLoading = false;
        })
        .addCase(sendFriendRequest.rejected, (state, action) => {
          state.isLoading = false;
          state.error = action.payload || action.error.message;
        })
        .addCase(acceptFriendRequest.pending, (state, action) => {
          state.isLoading = true;
        })
        .addCase(acceptFriendRequest.fulfilled, (state, action) => {
          state.isLoading = false;
        })
        .addCase(acceptFriendRequest.rejected, (state, action) => {
          state.isLoading = false;
          state.error = action.payload || action.error.message;
        });
    },
  });
  
  export const { setProfileData, setLoading, setError, resetProfile } = profileSlice.actions;
  
  export default profileSlice.reducer;