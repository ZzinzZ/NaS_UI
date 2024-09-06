"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Avatar,
  Container,
  Stack,
  IconButton,
  Tabs,
  Tab,
  Menu,
  MenuItem,
} from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import AvatarGroup from "@mui/material/AvatarGroup";
import EditIcon from "@mui/icons-material/Edit";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import ChatIcon from "@mui/icons-material/Chat";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import VisuallyHiddenInput from "../generals/VisuallyHiddenInput";
import {
  acceptFriendRequest,
  getProfile,
  rejectFriendRequest,
  removeFriendRequest,
  sendFriendRequest,
  updateAvatar,
  updateBackground,
} from "@/redux/thunks/profileThunk";
import { showLoading, hideLoading } from "@/redux/slices/LoadingSlice";
import FriendOverView from "./FriendOverView";
import { toast } from "react-toastify";
import { USER_AVATAR_ORIGINAL, USER_BACKGROUND_ORIGINAL } from "@/config/profileConfig";

const ProfileHeader = ({ user, profile, listFriend }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "post";
  const userId = searchParams.get("id");
  const { profileData } = useSelector((state) => state.profile);
  const [isOtherProfile, setIsOtherProfile] = useState(false);
  const [isFriend, setIsFriend] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [isRequesting, setIsRequesting] = useState(false);
  const [isRequested, setIsRequested] = useState(false);
  const [responseAnchorEl, setResponseAnchorEl] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [friendMenuAnchorEl, setFriendMenuAnchorEl] = useState(null);
  const [hoveredFriend, setHoveredFriend] = useState(null);

  useEffect(() => {
    if (user && profile) {
      setIsOtherProfile(user?._id !== userId);
      setIsFriend(
        profile?.friends?.some(
          (friend) => friend.userId.toString() === user?._id
        )
      );
      setIsRequested(
        profile?.sent_request?.some(
          (request) => request.userId.toString() === user?._id
        )
      );
      setIsRequesting(
        profile?.friend_request?.some(
          (request) => request.userId.toString() === user?._id
        )
      );
    }
  }, [user, profile, userId, dispatch, avatar]);

  const handleTabChange = (event, newValue) => {
    const params = new URLSearchParams(searchParams);
    params.set("tab", newValue);
    router.push(`/user/profile?id=${userId}&tab=${newValue}`);
  };

  const handleSendRequest = async () => {
    dispatch(showLoading());
    try {
      await dispatch(
        sendFriendRequest({ receptionId: userId, senderId: user?._id })
      );
      setIsRequesting(true);
    } catch (error) {
      console.error(error);
    } finally {
      dispatch(hideLoading());
    }
  };

  const handleRemoveRequest = async () => {
    dispatch(showLoading());
    try {
      dispatch(
        removeFriendRequest({ receiverId: userId, senderId: user?._id })
      );
      setIsRequesting(false);
    } catch (error) {
      console.error(error);
    } finally {
      dispatch(hideLoading());
    }
  };

  const openMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const closeMenu = () => {
    setAnchorEl(null);
  };

  const openResponseMenu = (event) => {
    setResponseAnchorEl(event.currentTarget);
  };

  const closeResponseMenu = () => {
    setResponseAnchorEl(null);
  };

  const handleAcceptRequest = async () => {
    dispatch(showLoading());
    try {
      await dispatch(
        acceptFriendRequest({ receiverId: user?._id, senderId: userId })
      );
      setIsFriend(true);
      closeResponseMenu();
    } catch (error) {
      console.error(error);
    } finally {
      dispatch(hideLoading());
    }
  };

  const handleRejectRequest = () => {
    dispatch(showLoading());
    try {
      dispatch(
        rejectFriendRequest({ receiverId: user?._id, senderId: userId })
      );
    } catch (error) {
      toast.error(error);
    } finally {
      dispatch(hideLoading());
    }
    setIsRequested(false);
    closeResponseMenu();
  };

  const handleFriendHover = (event, friend) => {
    setHoveredFriend(friend);
    setFriendMenuAnchorEl(event.currentTarget);
  };

  const closeFriendMenu = () => {
    setFriendMenuAnchorEl(null);
    setHoveredFriend(null);
  };
  const handleAvatarChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      dispatch(showLoading());
      try {
        await dispatch(
          updateAvatar({ userId: user?._id, avatarFile: file })
        );
        await dispatch(getProfile(user?._id));
      } catch (error) {
        console.log(error);
      } finally {
        dispatch(hideLoading());
      }
    }
  };

  const handleBackgroundChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      dispatch(showLoading());
      try {
        await dispatch(
          updateBackground({ userId: user?._id, backgroundFile: file })
        );
        await dispatch(getProfile(user?._id));
      } catch (error) {
        console.log(error);
      } finally {
        dispatch(hideLoading());
      }
    }
  };

  const avatarUrl = isOtherProfile
  ? profile?.avatar?.content?.media[0]?.media_url || USER_AVATAR_ORIGINAL
  : profileData?.avatar?.content?.media[0]?.media_url || USER_AVATAR_ORIGINAL;

  const backgroundUrl = isOtherProfile
  ? profile?.background?.content?.media[0]?.media_url || USER_BACKGROUND_ORIGINAL
  : profileData?.background?.content?.media[0]?.media_url || USER_BACKGROUND_ORIGINAL;

  return (
    <>
      <Box sx={{ background: "#fff", marginBottom: "1rem" }}>
        <Box
          sx={{
            position: "relative",
            height: "300px",
            background: `url(${
              backgroundUrl
            }) no-repeat center center/cover`,
          }}
          className="profile-background-gradient"
        >
          <Container maxWidth="background">
            <Box
              sx={{
                position: "relative",
                borderEndEndRadius: "0.4rem",
                borderBottomLeftRadius: "0.4rem",
                height: "300px",
                background: `url(${
                  backgroundUrl
                }) no-repeat center center/cover`,
              }}
            >
              {!isOtherProfile && (
                <Button
                  component="label"
                  variant="contained"
                  tabIndex={-1}
                  startIcon={<CameraAltIcon />}
                  sx={{
                    position: "absolute",
                    bottom: "20px",
                    right: "20px",
                    color: "black",
                  }}
                  className="profile-edit-background-button"
                >
                  Edit background
                  <VisuallyHiddenInput
                    type="file"
                    onChange={handleBackgroundChange}
                  />
                </Button>
              )}
            </Box>
          </Container>
        </Box>
        <Container maxWidth="content" sx={{ mt: -3}}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            spacing={2}
          >
            <Stack direction="row" alignItems="center" spacing={2}>
              <Stack direction="row">
                <Avatar
                  alt={user.name}
                  src={avatarUrl}
                  sx={{ width: 180, height: 180, border: "3px solid white" }}
                />
                {!isOtherProfile && (
                  <>
                    <IconButton
                      className="choose-avt"
                      component="label"
                      variant="contained"
                      tabIndex={-1}
                    >
                      <CameraAltIcon />
                      <VisuallyHiddenInput
                        type="file"
                        onChange={handleAvatarChange}
                      />
                    </IconButton>
                  </>
                )}
              </Stack>
              <Stack
                direction="column"
                alignItems="start"
                justifyContent="start"
              >
                <Typography
                  variant="h4"
                  sx={{ fontWeight: "700", paddingTop: "1rem" }}
                >
                  {profile?.userName}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: "600",
                    fontSize: "1rem",
                    color: "#797372",
                    padding: "0.5rem 0",
                  }}
                >
                  {profile?.friends?.length} friends
                </Typography>
                <AvatarGroup
                  total={profile?.friends?.length}
                  max={7}
                  sx={{
                    "& .MuiAvatarGroup-avatar": {
                      fontSize: 14,
                      width: 30,
                      height: 30,
                    },
                  }}
                >
                  {listFriend?.map((friend, index) => (
                    <Box
                      key={index}
                      onMouseEnter={(event) => handleFriendHover(event, friend)}
                      onMouseLeave={closeFriendMenu}
                    >
                      <Menu
                        anchorEl={friendMenuAnchorEl}
                        open={Boolean(
                          friendMenuAnchorEl && hoveredFriend === friend
                        )}
                        onClose={closeFriendMenu}
                        anchorOrigin={{
                          vertical: "top",
                          horizontal: "center",
                        }}
                        transformOrigin={{
                          vertical: "bottom",
                          horizontal: "center",
                        }}
                      >
                        <FriendOverView profile={friend} />
                      </Menu>
                      <Avatar
                        alt={friend.name}
                        src={friend?.avatar ? friend.avatar?.content?.media[0].media_url : USER_AVATAR_ORIGINAL}
                        sx={{ width: 30, height: 30 }}
                      />
                      
                    </Box>
                  ))}
                </AvatarGroup>
              </Stack>
            </Stack>
            {isOtherProfile ? (
              <Stack direction="row" alignItems="center" spacing={1}>
                {isFriend ? (
                  <Button variant="contained" startIcon={<CheckCircleIcon />}>
                    Friend
                  </Button>
                ) : isRequesting ? (
                  <Button
                    startIcon={<PersonRemoveIcon />}
                    className="grey-profile-button"
                    variant="outlined"
                    onClick={handleRemoveRequest}
                  >
                    Remove Request
                  </Button>
                ) : isRequested ? (
                  <>
                    <Button
                      startIcon={<PersonAddAlt1Icon />}
                      variant="contained"
                      onClick={openResponseMenu}
                    >
                      Response
                    </Button>
                    <Menu
                      anchorEl={responseAnchorEl}
                      open={Boolean(responseAnchorEl)}
                      onClose={closeResponseMenu}
                    >
                      <MenuItem onClick={handleAcceptRequest}>
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <PersonAddAlt1Icon />
                          <Typography>Accept</Typography>
                        </Stack>
                      </MenuItem>
                      <MenuItem onClick={handleRejectRequest}>
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <PersonRemoveIcon />
                          <Typography>Reject</Typography>
                        </Stack>
                      </MenuItem>
                    </Menu>
                  </>
                ) : (
                  <Button
                    startIcon={<PersonAddAlt1Icon />}
                    variant="contained"
                    onClick={handleSendRequest}
                  >
                    Add Friend
                  </Button>
                )}
                <Button
                  className="grey-profile-button"
                  variant="outlined"
                  startIcon={<ChatIcon />}
                  sx={{ ml: "auto" }}
                >
                  Text Message
                </Button>
              </Stack>
            ) : (
              <Stack direction="row" alignItems="center" spacing={1}>
                <Button variant="contained" sx={{ ml: "auto" }}>
                  + Add story
                </Button>
                <Button
                  startIcon={<EditIcon />}
                  className="grey-profile-button"
                  variant="outlined"
                >
                  Edit profile
                </Button>
              </Stack>
            )}
          </Stack>
          <Box sx={{ color: "#ccc", padding: "1rem 0" }}>
            <hr style={{ border: "0.5px solid #ccc" }} />
          </Box>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Stack>
              <Tabs value={tab} onChange={handleTabChange}>
                <Tab className="tab-navigation" label="Post" value="post" />
                <Tab
                  className="tab-navigation"
                  label="Introduce"
                  value="introduce"
                />
                <Tab className="tab-navigation" label="Friend" value="friend" />
                <Tab className="tab-navigation" label="Image" value="image" />
                <Tab className="tab-navigation" label="Video" value="video" />
              </Tabs>
            </Stack>
            <Button
              onClick={openMenu}
              sx={{ background: "#dedfe4", width: "2rem", height: "2rem" }}
            >
              <MoreHorizIcon sx={{ color: "#000" }} />
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={closeMenu}
              className="menu-container"
            >
              <MenuItem onClick={closeMenu}>View mode</MenuItem>
              <MenuItem onClick={closeMenu}>Search</MenuItem>
              <MenuItem onClick={closeMenu}>Archive</MenuItem>
              <MenuItem onClick={closeMenu}>Activity Log</MenuItem>
            </Menu>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default ProfileHeader;
