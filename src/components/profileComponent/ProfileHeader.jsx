"use client";
import React, { useCallback, useEffect, useState } from "react";
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
  useMediaQuery,
} from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import AvatarGroup from "@mui/material/AvatarGroup";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import VisuallyHiddenInput from "../generals/VisuallyHiddenInput";
import { useTheme } from "@mui/material/styles";
import {
  acceptFriendRequest,
  getProfile,
  rejectFriendRequest,
  removeFriendRequest,
  sendFriendRequest,
  unfriend,
  updateAvatar,
  updateBackground,
} from "@/redux/thunks/profileThunk";
import FriendOverView from "./FriendOverView";
import { toast } from "react-toastify";
import {
  USER_AVATAR_ORIGINAL,
  USER_BACKGROUND_ORIGINAL,
} from "@/config/profileConfig";
import GoChatButton from "../generals/GoChatButton";
import ConfirmationDialog from "../generals/ConfirmationDialog";
import { hideLoading, showLoading } from "@/redux/slices/LoadingSlice";
import { useSocket } from "@/contexts/SocketContext";
import { createUserNotification } from "@/utils/services/notification/notification.service";
import { userAgentFromString } from "next/server";

const ProfileHeader = ({ user, profile, listFriend }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "post";
  const userId = searchParams.get("id");
  const { profileData } = useSelector((state) => state.profile);
  const [isOtherProfile, setIsOtherProfile] = useState(false);
  const [isFriend, setIsFriend] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [isRequesting, setIsRequesting] = useState(false);
  const [isRequested, setIsRequested] = useState(false);
  const [responseAnchorEl, setResponseAnchorEl] = useState(null);
  const [friendMenuAnchorEl, setFriendMenuAnchorEl] = useState(null);
  const [hoveredFriend, setHoveredFriend] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openUnfriendMenu, setOpenUnfriendMenu] = useState(null);
  const {sendFriendRequestSocket, acceptFriendRequestSocket, rejectFriendRequestSocket} = useSocket();
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));



  const handleOpenUnfriendMenu = (event) => {
    setOpenUnfriendMenu(event.currentTarget);
  };
  const handleCloseUnfriendMenu = () => {
    setOpenUnfriendMenu(null);
  };

  const handleViewMoreClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

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
    try {
      await dispatch(
        sendFriendRequest({ receptionId: userId, senderId: user?._id })
      );
      const message = `${user?.name} has just sent you a friend request`;
      const notify = await createUserNotification({userId:userId, message, refUser: user?._id});
      setIsRequesting(true);
      sendFriendRequestSocket(userId, notify);
    } catch (error) {
      console.error(error);
    }
  };

  const handleRemoveRequest = async () => {
    try {
      dispatch(
        removeFriendRequest({ receiverId: userId, senderId: user?._id })
      );
      setIsRequesting(false);
    } catch (error) {
      console.error(error);
    }
  };

  const openResponseMenu = (event) => {
    setResponseAnchorEl(event.currentTarget);
  };

  const closeResponseMenu = () => {
    setResponseAnchorEl(null);
  };

  const handleAcceptRequest = async () => {
    try {
      await dispatch(
        acceptFriendRequest({ receiverId: user?._id, senderId: userId })
      );
      setIsFriend(true);
      const message = `${user?.name} has accepted the friend request`;
      const notify = await createUserNotification({userId: userId, message, refUser: user?._id});
      acceptFriendRequestSocket(userId, notify);
      closeResponseMenu();
    } catch (error) {
      console.error(error);
    }
  };

  const handleRejectRequest = async () => {
    try {
      dispatch(
        rejectFriendRequest({ receiverId: user?._id, senderId: userId })
      );
      const message = `${user?.name} has rejected the friend request`;
      const notify = await createUserNotification({userId: userId, message, refUser: user?._id});
      rejectFriendRequestSocket(userId, notify);
    } catch (error) {
      toast.error(error);
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
      try {
        dispatch(showLoading());
        await dispatch(updateAvatar({ userId: user?._id, avatarFile: file }));
        await dispatch(getProfile(user?._id));
      } catch (error) {
        console.log(error);
        toast.error("Upload failed ", error);
        dispatch(hideLoading());
      }
      {
        dispatch(hideLoading());
      }
    }
  };

  const handleBackgroundChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        dispatch(showLoading());
        await dispatch(
          updateBackground({ userId: user?._id, backgroundFile: file })
        );
        await dispatch(getProfile(user?._id));
      } catch (error) {
        toast.error("Upload failed ", error);
        dispatch(hideLoading());
        console.log(error);
      } finally {
        dispatch(hideLoading());
      }
    }
  };

  const unfriendClick = () => {
    dispatch(unfriend({ userId: user?._id, friendId: profile?.userId }));
    setOpenUnfriendMenu(null);
    setIsFriend(false);
  };

  const avatarUrl = isOtherProfile
    ? profile?.avatar?.content?.media[0]?.media_url || USER_AVATAR_ORIGINAL
    : profileData?.avatar?.content?.media[0]?.media_url || USER_AVATAR_ORIGINAL;

  const backgroundUrl = isOtherProfile
    ? profile?.background?.content?.media[0]?.media_url ||
      USER_BACKGROUND_ORIGINAL
    : profileData?.background?.content?.media[0]?.media_url ||
      USER_BACKGROUND_ORIGINAL;

  return (
    <>
      <Box sx={{ background: "#fff", marginBottom: "1rem" }}>
        <Box
          sx={{
            position: "relative",
            height: "300px",
            background: `url(${backgroundUrl}) no-repeat center center/cover`,
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
                background: `url(${backgroundUrl}) no-repeat center center/cover`,
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
                    bottom: { xs: "40px", sm: "30px", md: "20px" },
                    right: "20px",
                    color: "black",
                  }}
                  className="profile-edit-background-button"
                >
                  <Typography
                    sx={{ display: { xs: "none", sm: "block", md: "block" } }}
                  >
                    Edit background
                  </Typography>
                  <VisuallyHiddenInput
                    type="file"
                    onChange={handleBackgroundChange}
                  />
                </Button>
              )}
            </Box>
          </Container>
        </Box>
        <Container maxWidth="content" sx={{ mt: -3 }}>
          <Stack
            direction={{ xs: "column", sm: "column", md: "row" }}
            alignItems="center"
            justifyContent="space-between"
            spacing={2}
          >
            <Stack
              direction={{ xs: "column", sm: "column", md: "row" }}
              alignItems="center"
              spacing={2}
            >
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
                justifyContent={{ xs: "center", sm: "center", md: "start" }}
                sx={{ textAlign: { xs: "center", sm: "center", md: "start" } }}
              >
                <Typography
                  variant="h4"
                  sx={{ fontWeight: "700", paddingTop: "1rem" }}
                >
                  {profile?.userName}
                </Typography>
                <Stack
                  justifyContent={{ xs: "center", sm: "center", md: "start" }}
                  alignItems={{ xs: "center", sm: "center", md: "start" }}
                  sx={{ width: "100%" }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: "600",
                      fontSize: "1rem",
                      color: "#797372",
                      padding: "0.5rem 0",
                      textAlign: { xs: "center", sm: "center", md: "start" },
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
                        onMouseEnter={(event) =>
                          handleFriendHover(event, friend)
                        }
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
                          disableScrollLock={true}
                        >
                          <FriendOverView profile={friend} />
                        </Menu>
                        <Avatar
                          alt={friend.name}
                          src={
                            friend?.avatar
                              ? friend.avatar?.content?.media[0].media_url
                              : USER_AVATAR_ORIGINAL
                          }
                          sx={{ width: 30, height: 30 }}
                        />
                      </Box>
                    ))}
                  </AvatarGroup>
                </Stack>
              </Stack>
            </Stack>
            {isOtherProfile ? (
              <Stack direction="row" alignItems="center" spacing={1}>
                <Menu
                  anchorEl={openUnfriendMenu}
                  open={Boolean(openUnfriendMenu)}
                  onClose={handleCloseUnfriendMenu}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "center",
                  }}
                  transformOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                  }}
                  disableScrollLock={true}
                >
                  <MenuItem onClick={unfriendClick}>
                    <Stack direction="row" spacing={1}>
                      <PersonRemoveIcon sx={{ color: "#ccc" }} />
                      <Typography>Unfriend</Typography>
                    </Stack>
                  </MenuItem>
                </Menu>
                {isFriend ? (
                  <Button
                    variant="contained"
                    onClick={handleOpenUnfriendMenu}
                    startIcon={<CheckCircleIcon />}
                  >
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
                      disableScrollLock={true}
                    >
                      <MenuItem onClick={handleAcceptRequest}>
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <PersonAddAlt1Icon  sx={{ color: "#ccc" }} />
                          <Typography>Accept</Typography>
                        </Stack>
                      </MenuItem>
                      <MenuItem onClick={handleRejectRequest}>
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <PersonRemoveIcon  sx={{ color: "#ccc" }}/>
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
                <GoChatButton userId={userId} />
              </Stack>
            ) : (
              <Stack direction="row" alignItems="center" spacing={1}></Stack>
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

                {!isMobile && (
                  <Tab
                    className="tab-navigation"
                    label="Friend"
                    value="friend"
                  />
                )}
                {!isMobile && (
                  <Tab
                    className="tab-navigation"
                    label="Library"
                    value="library"
                  />
                )}

                {isMobile && (
                  <Button
                    onClick={handleViewMoreClick}
                    style={{ minWidth: "auto" }}
                  >
                    <Typography sx={{ color: "#666666", fontWeight: 600 }}>
                      View more
                    </Typography>
                  </Button>
                )}
              </Tabs>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleCloseMenu}
              >
                <Tabs value={tab} onChange={handleTabChange}>
                  <Tab
                    className="tab-navigation"
                    label="Friend"
                    value="friend"
                    onClick={handleCloseMenu}
                  />
                  <Tab
                    className="tab-navigation"
                    label="Library"
                    value="library"
                    onClick={handleCloseMenu}
                  />
                </Tabs>
              </Menu>
            </Stack>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default ProfileHeader;
