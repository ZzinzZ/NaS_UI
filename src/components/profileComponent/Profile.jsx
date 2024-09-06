"use client";
import React, { useEffect, useState } from "react";
import ProfileHeader from "./ProfileHeader";
import IntroduceOverView from "./IntroduceOverView";
import { useSelector, useDispatch } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
import { getListFriends, getProfile } from "@/redux/thunks/profileThunk";
import { toast } from "react-toastify";
import { baseUrl, getRequest } from "@/utils/services/requestService";
import { hideLoading, showLoading } from "@/redux/slices/LoadingSlice";
import { Box, Container, Stack } from "@mui/material";
import ProfileImages from "./ProfileImages";
import ProfileFriendOverview from "./ProfileFriendOverview";
import PostCreateComponent from "./PostCreateComponent";
import ProfileIntroduce from "./ProfileIntroduce";
import { getUserArticlePosts } from "@/redux/thunks/postThunk";
import PostItem from "../postComponent/PostItem";
import { useInView } from "react-intersection-observer";

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
  const [isVideoTab, setIsVideoTab] = useState(false);
  const [isPostTab, setIsPostTab] = useState(true);
  const [forceRender, setForceRender] = useState(false);
  const [isOtherProfile, setIsOtherProfile] = useState(false);
  const { user, token } = useSelector((state) => state.auth);
  const [posts, setPosts] = useState([]);

  const { profileData, isLoading, error } = useSelector(
    (state) => state.profile
  );

  useEffect(() => {
    switch (tab) {
      case "introduce":
        setIsIntroduceTab(true);
        setIsFriendTab(false);
        setIsImageTab(false);
        setIsVideoTab(false);
        setIsPostTab(false);
        break;
      case "friend":
        setIsIntroduceTab(false);
        setIsFriendTab(true);
        setIsImageTab(false);
        setIsVideoTab(false);
        setIsPostTab(false);
        break;
      case "image":
        setIsIntroduceTab(false);
        setIsFriendTab(false);
        setIsImageTab(true);
        setIsVideoTab(false);
        setIsPostTab(false);
        break;
      case "video":
        setIsIntroduceTab(false);
        setIsFriendTab(false);
        setIsImageTab(false);
        setIsVideoTab(true);
        setIsPostTab(false);
        break;
      case "post":
        setIsPostTab(true);
        setIsIntroduceTab(false);
        setIsFriendTab(false);
        setIsImageTab(false);
        setIsVideoTab(false);
        break;
      default:
        setIsPostTab(true);
        setIsIntroduceTab(false);
        setIsFriendTab(false);
        setIsImageTab(false);
        setIsVideoTab(false);
        break;
    }
  }, [tab]);


  useEffect(() => {
    const getProfileInfo = async () => {
      dispatch(showLoading());
      try {
        const response = await getRequest(
          `${baseUrl}/profiles/find_by_userId/${id}`
        );
        setProfile(response.data);
      } catch (error) {
        toast.error(error);
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
        toast.error(error);
        console.log(error);
      }
    };
    if (id !== user?._id) {
      setIsOtherProfile(true);
    }

    const getPostList = async () => {
      if (user?._id) {
        try {
          const userPost = await dispatch(getUserArticlePosts(id)).unwrap(); 
          setPosts(userPost);
        } catch (error) {
          console.error('Failed to fetch posts:', error); 
          toast.error("Failed to fetch posts");
        }
      }
    }
    getPostList();
    
    
    getProfileInfo();
    getListFriendsProfile();
  }, [id, dispatch, user]);

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

  return (
    <>
      {profile && (
        <ProfileHeader user={user} profile={profile} listFriend={listFriend} />
      )}
      <Container maxWidth="content">
        {profile && isPostTab && (
          <Stack direction="row" spacing={2}>
            <Stack sx={{ width: "35%" }}>
              <IntroduceOverView user={user} profile={profile} />
              <ProfileImages />
              <ProfileFriendOverview friendList={listFriend}/>
            </Stack>
            <Stack sx={{ width: "65%" }}>
              <PostCreateComponent />
              {posts &&
                posts?.map((post, index) => (
                  <LazyLoadPost key={index} profile={profile} postItem={post} />
                ))}
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
      </Container>
    </>
  );
};

const LazyLoadPost = ({ profile, postItem }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,  
    threshold: 0.1,     
  });

  return (
    <Box ref={ref} sx={{ minHeight: '100px' }}>
      {inView ? <PostItem profile={profile} postItem={postItem} /> : null}
    </Box>
  );
};

export default Profile;
