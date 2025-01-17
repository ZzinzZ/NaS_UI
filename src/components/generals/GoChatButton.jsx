"use client";
import { findChatByParticipants } from "@/utils/services/chatService/chatService";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";
import ChatIcon from "@mui/icons-material/Chat";
import React from "react";
import { useSelector } from "react-redux";
import { useSocket } from "@/contexts/SocketContext";

const GoChatButton = ({ userId }) => {
  const { user = null } = useSelector((state) => state.auth ?? {});
  const {setChat} = useSocket();
  const router = useRouter();

  const handleGoToChat = async () => {
    if (!user?._id || !userId) {
      return;
    }

    try {
      // Tìm đoạn chat
      const chat = await findChatByParticipants({
        userId: user._id,
        participantId: userId,
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
    <Button
      className="grey-profile-button"
      variant="outlined"
      startIcon={<ChatIcon />}
      sx={{ ml: "auto" }}
      onClick={handleGoToChat}
    >
      Message
    </Button>
  );
};

export default GoChatButton;
