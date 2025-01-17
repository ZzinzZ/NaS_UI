"use client"
import { Avatar, Box, Button, Stack, Typography } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useRouter } from "next/navigation";
import React from "react";
import { USER_AVATAR_ORIGINAL } from "@/config/profileConfig";
import { useSelector } from "react-redux";
import { findChatByParticipants } from "@/utils/services/chatService/chatService";
import { useSocket } from "@/contexts/SocketContext";

const FriendOverView = ({ profile }) => {
  const {user} = useSelector((state) => state.auth)
  const {setChat} = useSocket();
  const router = useRouter();
  const handleViewProfile = () => {
    router.push(`/user/profile?id=${profile?.userId}`);
  };

  const handleGoToChat = async () => {
    if (!user?._id || !profile) {
      return;
    }

    try {
      // Tìm đoạn chat
      const chat = await findChatByParticipants({
        userId: user._id,
        participantId: profile?.userId,
      });
      if (chat) {
        setChat(chat);
        router.push(`/user?chat-id=${chat?._id}`);
      }
    } catch (error) {
      console.log(error);
    }
  };
  
  return (
    <Box sx={{ background: "#fff", padding: "1rem" }}>
      <Stack
        spacing={{ xs: 2, sm: 1 }}
        sx={{ background: "#fff" }}
        direction="row"
        useFlexGap
        flexWrap="wrap"
        alignItems="center"
      >
        <Box sx={{ background: "#fff" }}>
          <Avatar
           src={profile?.avatar ? profile.avatar?.content?.media[0].media_url : USER_AVATAR_ORIGINAL}
            alt={profile?.userName}
            sx={{ width: 120, height: 120 }}
          />
        </Box>
        <Stack spacing={1}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {profile?.userName}
          </Typography>
          <Stack sx={{ background: "#fff" }} spacing={2}>
            <Button
              className="grey-profile-button"
              startIcon={<AccountCircleIcon />}
              variant="outlined"
              onClick={handleViewProfile}
            >
              View Profile
            </Button>
            <Button variant="contained" startIcon={<ChatIcon />} onClick={handleGoToChat}>
              Message
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
};

export default FriendOverView;
