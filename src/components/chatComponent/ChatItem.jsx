import React, { useEffect, useState, memo, useCallback } from "react";
import {
  Avatar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import ActiveAvatar from "./ActiveAvatar";
import { useSearchParams } from "next/navigation";
import { useSocket } from "@/contexts/SocketContext"; 
import { useSelector } from "react-redux";
import { getChatDetails } from "@/utils/services/chatService/chatService";
import ChatItemLoading from "./ChatItemLoading";
import { countUnreadMessages } from "@/utils/services/messageService/message.service";

const ChatItem = ({ chat, onDeleteMessage, onPinMessage, isReadMessage, setIsReadMessage }) => {
  const [isCurrent, setIsCurrent] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [chatName, setChatName] = useState("");
  const [countUnread, setCountUnread] = useState(0)
  const [loadingChat, setIsLoadingChat] = useState(false);
  const [chatAvatar, setChatAvatar] = useState("");
  const [lastMessage, setLastMessage] = useState("");
  const searchParams = useSearchParams();
  const chatId = searchParams.get("chat-id");
  const { user } = useSelector((state) => state.auth);

  const { onlineUsers, messages, newMessage } = useSocket();

  useEffect(() => {
    if (chat.type === "group") {
      const otherParticipants = chat.participants.filter(
        (participant) => participant.userId !== user._id
      );
      const isChatActive = otherParticipants.some((participant) =>
        onlineUsers.some(
          (onlineUser) => onlineUser.userId === participant.userId
        )
      );
      setIsActive(isChatActive);
    }
    if (chat.type === "private") {
      const otherParticipant = chat.participants.find(
        (participant) => participant.userId !== user._id
      );
      const isChatActive = onlineUsers.some(
        (onlineUser) => onlineUser.userId === otherParticipant.userId
      );
      setIsActive(isChatActive);
    }
  }, [onlineUsers, chat, user._id]);

  const getParticipants = useCallback(async () => {
    try {
      setIsLoadingChat(true);
      const response = await getChatDetails({ chatId: chat._id });
      const countResponse = await countUnreadMessages({chatId: chat?._id, userId: user._id});
      setCountUnread(countResponse);
      const otherParticipants = response.participantProfiles.find(
        (participant) => participant.userId !== user._id
      );
      setChatName(otherParticipants.userName);
      setChatAvatar(otherParticipants.avatar?.content?.media[0].media_url);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingChat(false);
    }
  }, [chat._id, user._id]);

  useEffect(() => {
    setIsCurrent(chat._id.toString() === chatId);

    if (chat._id.toString() === chatId) {
      setIsReadMessage(true);
    }
    if (chat.type === "private") {
      getParticipants();
    }
  }, [chatId, chat, getParticipants, setIsReadMessage]);

  useEffect(() => {
    if (!chat?.last_message?.messId) {
      setLastMessage("Say hello 🙌");
    } else if (chat?.last_message?.messId?.content?.text) {
      setLastMessage(chat.last_message.messId.content.text);
    } else if (chat?.last_message?.messId?.content?.image?.length > 0) {
      setLastMessage("Image");
    } else if (chat?.last_message?.messId?.content?.file) {
      setLastMessage("File");
    }
    console.log(chat);
    
  }, [chat]);

  useEffect(() => {
    if (
      chat.last_message?.messId &&
      (chat.last_message.messId.status.seen_by.some((u) => u === user?._id) ||
        chat.last_message.senderId === user._id)
    ) {
      setIsReadMessage(true);
    } else {
      setIsReadMessage(false);
    }
  }, [messages, newMessage, chat, user._id, setIsReadMessage]);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteMessage = () => {
    onDeleteMessage && onDeleteMessage();
  };

  const handlePinMessage = () => {
    onPinMessage && onPinMessage();
  };

  return (
    <Box
      sx={{
        background: isCurrent ? "#EDEDED" : "transparent",
        padding: "0.5rem 1rem",
        width: "18rem",
        cursor: "pointer",
        "&:hover": {
          backgroundColor: "#EDEDED !important",
        },
      }}
    >
      {loadingChat ? (
        <ChatItemLoading />
      ) : (
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          justifyContent="space-between"
        >
          <Stack direction="row" spacing={1} alignItems="center">
            {isActive ? (
              <ActiveAvatar
                image_url={chat.type === "group" ? chat?.avatar : chatAvatar}
              />
            ) : (
              <Avatar
                sx={{ width: 50, height: 50 }}
                src={chat.type === "group" ? chat?.avatar : chatAvatar}
              />
            )}
            <Stack>
              <Typography
                variant="h8"
                sx={{
                  fontWeight: 550,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  width: "10rem",
                }}
              >
                {chat?.type === "group" ? chat?.chat_name : chatName}
              </Typography>
              <Typography
                sx={{
                  color: isReadMessage ? "#5e5e5e" : "#000",
                  fontSize: "0.8rem",
                  fontWeight: isReadMessage ? 400 : 600,
                }}
              >
                {lastMessage}
              </Typography>
            </Stack>
          </Stack>
          <IconButton onClick={handleMenuOpen}>
            <MoreHorizIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            disableScrollLock={true}
            anchorOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
            transformOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
          >
            <MenuItem onClick={handleDeleteMessage}>Delete messages</MenuItem>
            <MenuItem onClick={handlePinMessage}>Pin messages</MenuItem>
          </Menu>
        </Stack>
      )}
    </Box>
  );
};

// Export component with React.memo
export default memo(ChatItem);
