import { createSlice } from "@reduxjs/toolkit";
import {
  acceptFriendRequest,
  getListFriends,
  getProfile,
  rejectFriendRequest,
  sendFriendRequest,
  unfriend,
} from "../thunks/profileThunk";

const initialState = {
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
    },
    updateProfileAvatar(state, action) {
      state.profileData.avatar = action.payload;
    },
    updateProfileBackground(state, action) {
      state.profileData.background = action.payload;
    },
    updateProfileBio(state, action) {
      state.profileData.bio = action.payload;
    },
  },
  // extraReducers: (builder) => {
  //   builder
  //     // .addCase(getProfile?.fulfilled, (state, action) => {
  //     //   state.isLoading = false;
  //     //   state.profileData = action.payload;

  //     // })
  //     .addCase(getListFriends?.fulfilled, (state, action) => {
  //       state.listFriend = action.payload;
  //       console.log("List friends:",action.payload);
  //       state.isLoading = false;
  //     })
  // },
});

export const {
  setProfileData,
  setLoading,
  setError,
  resetProfile,
  updateProfileAvatar,
  updateProfileBackground,
  updateProfileBio,
} = profileSlice.actions;

export default profileSlice.reducer;
