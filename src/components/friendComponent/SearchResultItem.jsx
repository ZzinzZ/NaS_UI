"use client";
import {
  Avatar,
  Box,
  Button,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  acceptFriendRequest,
  rejectFriendRequest,
  removeFriendRequest,
  sendFriendRequest,
  unfriend,
} from "@/redux/thunks/profileThunk";
import { useRouter } from "next/navigation";
import { createPrivateChat } from "@/utils/services/chatService/chatService";
import { useSocket } from "@/contexts/SocketContext";
import { createUserNotification } from "@/utils/services/notification/notification.service";

const SearchResultItem = ({ profile }) => {
  const { user = null } = useSelector((state) => state.auth ?? {});

  const dispatch = useDispatch();
  const [isFriend, setIsFriend] = useState(false);
  const [isSentRequest, setIsSentRequested] = useState(false);
  const [isReceivedRequest, setIsReceivedRequest] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null); // State cho menu
  const {
    sendFriendRequestSocket,
    acceptFriendRequestSocket,
    rejectFriendRequestSocket,
  } = useSocket();
  const router = useRouter();

  const handleSendRequest = async () => {
    try {
      dispatch(
        sendFriendRequest({ receptionId: profile?.userId, senderId: user._id })
      );
      sendFriendRequestSocket(profile?.userId);
      setIsSentRequested(true);
      const message = `${user?.name} has just sent you a friend request`;
      await createUserNotification({
        userId: profile?.userId,
        message,
        refUser: user?._id,
      });
    } catch (error) {
      console.log(error);
    }
  };
  const handleSelectProfile = (userId) => {
    router.push(`/user/profile?id=${userId}`);
  };

  const handleRemoveRequest = async () => {
    try {
      removeFriendRequest({ receiverId: profile.userId, senderId: user._id });
      setIsSentRequested(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleUnfriend = async () => {
    try {
      unfriend({ userId: user._id, friendId: profile.userId });
      setIsFriend(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAcceptRequest = async () => {
    try {
      dispatch(
        acceptFriendRequest({ receiverId: user._id, senderId: profile?.userId })
      );
      await createPrivateChat({
        userId: user._id,
        participants: [profile?.userId],
      });
      const message = `${user?.name} has accepted the friend request`;
      const notify = await createUserNotification({
        userId: profile?.userId,
        message,
        refUser: user?._id,
      });
      acceptFriendRequestSocket(profile?.userId, notify);
      setIsReceivedRequest(false);
      setIsFriend(true);
      setAnchorEl(null);
    } catch (error) {
      setAnchorEl(null);
      console.log(error);
    }
  };

  const handleRejectRequest = async () => {
    try {
      dispatch(
        rejectFriendRequest({
          receiverId: user?._id,
          senderId: profile?.userId,
        })
      );
      setAnchorEl(null);
      const message = `${user?.name} has rejected the friend request`;
      const notify = await createUserNotification({
        userId: profile?.userId,
        message,
        refUser: user?._id,
      });
      rejectFriendRequestSocket(profile?.userId, notify);
    } catch (error) {
      setAnchorEl(null);
      console.log(error);
    }
  };

  const handleClickResponse = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    const checkStatusProfile = () => {
      if (profile.friend_request.some((request) => request.userId === user._id))
        setIsSentRequested(true);
      else if (
        profile.sent_request.some((request) => request.userId === user._id)
      )
        setIsReceivedRequest(true);
      else if (profile.friends.some((friend) => friend.userId === user._id))
        setIsFriend(true);
    };
    checkStatusProfile();
  }, [profile, user._id]);

  return (
    <Box
      sx={{
        background: "#fff",
        borderRadius: "1rem",
        padding: "1rem",
        boxShadow: "0 1px 2px rgba(0,0,0,0.2)",
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          onClick={() => handleSelectProfile(profile.userId)}
        >
          <Avatar src={profile.avatar?.content?.media[0].media_url} />
          <Stack>
            <Typography variant="h7" sx={{ fontWeight: 600 }}>
              {profile.userName}
            </Typography>
          </Stack>
        </Stack>

        <Stack direction="row" spacing={1}>
          {profile.userId !== user._id && (
            <>
              {isFriend && (
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<PersonRemoveIcon />}
                  onClick={handleUnfriend}
                >
                  Unfriend
                </Button>
              )}
              {isSentRequest && (
                <Button
                  variant="outlined"
                  startIcon={<HighlightOffIcon />}
                  onClick={handleRemoveRequest}
                >
                  Remove Request
                </Button>
              )}
              {isReceivedRequest && (
                <>
                  <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<CompareArrowsIcon />}
                    onClick={handleClickResponse}
                  >
                    Response
                  </Button>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                  >
                    <MenuItem onClick={handleAcceptRequest}>Accept</MenuItem>
                    <MenuItem onClick={handleRejectRequest}>Decline</MenuItem>
                  </Menu>
                </>
              )}
              {!isFriend && !isSentRequest && !isReceivedRequest && (
                <Button
                  variant="outlined"
                  startIcon={<PersonAddAlt1Icon />}
                  onClick={handleSendRequest}
                >
                  Add Friend
                </Button>
              )}
            </>
          )}
        </Stack>
      </Stack>
    </Box>
  );
};

export default SearchResultItem;
