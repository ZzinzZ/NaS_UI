"use client";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
import { getProfile, getListFriends } from "@/redux/thunks/profileThunk";
import { toast } from "react-toastify";
import { Box, Container, Stack, Typography } from "@mui/material";
import ProfileHeader from "./ProfileHeader";
import IntroduceOverView from "./IntroduceOverView";
import ProfileImages from "./ProfileImages";
import ProfileFriendOverview from "./ProfileFriendOverview";
import PostCreateComponent from "./PostCreateComponent";
import ProfileIntroduce from "./ProfileIntroduce";
import { getUserArticlePosts } from "@/redux/thunks/postThunk";
import PostItem from "../postComponent/PostItem";
import ProfileFriend from "./ProfileFriend";
import InboxIcon from "@mui/icons-material/Inbox";
import ProfileLibrary from "./ProfileLibrary";
import { showLoading, hideLoading } from "@/redux/slices/LoadingSlice";
import { baseUrl, getRequest } from "@/utils/services/requestService";

const Profile = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const tab = searchParams.get("tab");
  const [profile, setProfile] = useState(null);
  const [listFriend, setListFriend] = useState(null);
  const [isIntroTab, setIsIntroduceTab] = useState(false);
  const [isFriendTab, setIsFriendTab] = useState(false);
  const [isImageTab, setIsImageTab] = useState(false);
  const [isPostTab, setIsPostTab] = useState(true);
  const [isOtherProfile, setIsOtherProfile] = useState(false);
  const { user, token } = useSelector((state) => state.auth);
  const [posts, setPosts] = useState([]);
  const { profileData, isLoading, error } = useSelector(
    (state) => state.profile
  );

  // Xử lý chuyển tab
  useEffect(() => {
    switch (tab) {
      case "introduce":
        setIsIntroduceTab(true);
        setIsFriendTab(false);
        setIsImageTab(false);
        setIsPostTab(false);
        break;
      case "friend":
        setIsIntroduceTab(false);
        setIsFriendTab(true);
        setIsImageTab(false);
        setIsPostTab(false);
        break;
      case "library":
        setIsIntroduceTab(false);
        setIsFriendTab(false);
        setIsImageTab(true);
        setIsPostTab(false);
        break;
      case "video":
        setIsIntroduceTab(false);
        setIsFriendTab(false);
        setIsImageTab(false);
        setIsPostTab(false);
        break;
      case "post":
        setIsPostTab(true);
        setIsIntroduceTab(false);
        setIsFriendTab(false);
        setIsImageTab(false);
        break;
      default:
        setIsPostTab(true);
        setIsIntroduceTab(false);
        setIsFriendTab(false);
        setIsImageTab(false);
        break;
    }
  }, [tab]);

  const getPostList = async () => {
    if (user?._id) {
      try {
        const userPost = await dispatch(getUserArticlePosts(id)).unwrap();
        setPosts(userPost);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
        toast.error("Failed to fetch posts");
      }
    }
  };

  // Lấy dữ liệu profile, friends và posts
  useEffect(() => {
    const getProfileInfo = async () => {
      dispatch(showLoading());
      try {
        const response = await getRequest(
          `${baseUrl}/profiles/find_by_userId/${id}`
        );
        setProfile(response.data);
      } catch (error) {
        toast.error(error.message);
        console.log(error);
      } finally {
        dispatch(hideLoading());
      }
    };

    const getListFriendsProfile = async () => {
      try {
        const response = await getRequest(
          `${baseUrl}/profiles/friends/list/${id}`
        );
        setListFriend(response.data);
      } catch (error) {
        toast.error(error.message);
        console.log(error);
      }
    };

    if (id !== user?._id) {
      setIsOtherProfile(true);
    }

    getPostList();
    getProfileInfo();
    getListFriendsProfile();
  }, [id, dispatch, user]);

  // Kiểm tra token đăng nhập
  useEffect(() => {
    if (!token) {
      router.push("/login");
    } else if (user?._id) {
      dispatch(getProfile(user?._id));
    }
  }, [token, user, dispatch, router, id]);

  useEffect(() => {
    if (user && error) {
      toast.info(error);
    }
  }, [user, profileData, isLoading, error, router]);

  const handleUpdateListPost = () => {
    getPostList();
  };

  return (
    <Box>
      {profile && (
        <ProfileHeader user={user} profile={profile} listFriend={listFriend} />
      )}
      <Container maxWidth="content">
        {profile && isPostTab && (
          <Stack direction="row" spacing={{ xs: 0, sm: 0, md: 2 }}>
            <Stack
              sx={{
                width: "35%",
                height: "100vh",
                overflow: "scroll",
                display: { xs: "none", sm: "none", md: "block" },
                "&::-webkit-scrollbar": {
                  display: "none",
                },
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              <IntroduceOverView user={user} profile={profile} />
              <ProfileImages />
              <ProfileFriendOverview friendList={listFriend} />
            </Stack>
            <Stack
              sx={{
                width: { xs: "100%", sm: "100%", md: "65%" },
                height: "100vh",
                overflow: "scroll",
                "&::-webkit-scrollbar": {
                  display: "none",
                },
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              {!isOtherProfile && (
                <PostCreateComponent onNew={handleUpdateListPost} />
              )}
              {posts?.length > 0 ? (
                posts?.map((post) => (
                  <PostItem
                    key={post._id}
                    profile={profile}
                    postItem={post}
                    onDelete={handleUpdateListPost}
                  />
                ))
              ) : (
                <Stack alignItems="center" justifyContent="center">
                  <InboxIcon sx={{ fontSize: "3rem", color: "#ddd" }} />
                  <Typography variant="body1" sx={{ fontStyle: "italic" }}>
                    No post
                  </Typography>
                </Stack>
              )}
            </Stack>
          </Stack>
        )}
        {profile && isIntroTab && (
          <ProfileIntroduce
            profile={profile}
            user={user}
            isOtherProfile={isOtherProfile}
          />
        )}
        {profile && isFriendTab && <ProfileFriend listFriend={listFriend} />}
        {profile && isImageTab && <ProfileLibrary userId={id} />}
      </Container>
    </Box>
  );
};

export default Profile;
