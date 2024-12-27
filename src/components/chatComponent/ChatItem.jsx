"use client";
import React, { useEffect, useState, memo, useCallback } from "react";
import {
  Avatar,
  Box,
  Menu,
  MenuItem,
  Stack,
  Typography,
  Badge,
} from "@mui/material";
import ActiveAvatar from "./ActiveAvatar";
import { useSearchParams } from "next/navigation";
import { useSocket } from "@/contexts/SocketContext";
import { useSelector } from "react-redux";
import { getChatDetails } from "@/utils/services/chatService/chatService";
import ChatItemLoading from "./ChatItemLoading";
import GroupsIcon from '@mui/icons-material/Groups';
import {
  countUnreadMessages,
  deleteChatMessages,
} from "@/utils/services/messageService/message.service";
import moment from "moment";

const ChatItem = ({ chat, setIsReadMessage, setIsDeleteMessages, onDeleteChatMessages }) => {
  const [isCurrent, setIsCurrent] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [chatName, setChatName] = useState("");
  const [countUnread, setCountUnread] = useState(0);
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
  }, [onlineUsers, chat]);

  const getParticipants = useCallback(async () => {
    console.log("returning participants");
    
    try {
      setIsLoadingChat(true);
      const response = await getChatDetails({ chatId: chat._id });
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
    const fetchUnreadCount = async () => {
      try {
        const countResponse = await countUnreadMessages({
          chatId: chat._id,
          userId: user._id,
        });
        setCountUnread(countResponse);
      } catch (error) {
        console.log("Error fetching unread messages count:", error);
      }
    };

    if (isCurrent) {
      setCountUnread(0);
    } else if (chat && user) {
      fetchUnreadCount();
    }
  }, [messages, newMessage, setIsReadMessage, chat]);

  useEffect(() => {
    if (chat._id.toString() === chatId) {
      setIsReadMessage(true);
    }
    if (chat.type === "private") {
      getParticipants();
    }
  }, [chat, getParticipants, setIsReadMessage]);

  useEffect(() => {
    setIsCurrent(chat._id.toString() === chatId);
  }, [chatId, chat]);

  useEffect(() => {
    if (!chat?.last_message?.messId) {
      setLastMessage("Say hello 🙌");
    } else if (chat?.last_message?.messId?.content?.text) {
      setLastMessage(chat.last_message.messId.content.text);
    } else if (chat?.last_message?.messId?.content?.image?.length > 0) {
      setLastMessage("Image 🖼️");
    } else if (chat?.last_message?.messId?.content?.file) {
      setLastMessage("File 📁");
    } else if (chat?.last_message?.messId?.content?.call) {
      setLastMessage("Call 📞");
    }
  }, [chat]);

  useEffect(() => {
    if (
      chat.last_message?.messId &&
      (chat.last_message?.messId?.status?.seen_by.some(
        (u) => u === user?._id
      ) ||
        chat.last_message.senderId === user._id)
    ) {
      setIsReadMessage(true);
    } else {
      setIsReadMessage(false);
    }
  }, [messages, newMessage, chat, user._id, setIsReadMessage]);

  const handleMenuOpen = useCallback((event) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleMenuClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleDeleteMessage = async () => {
    try {
      const response = await deleteChatMessages({ chatId: chat._id, userId: user._id });
      onDeleteChatMessages(response?._id);
      setIsDeleteMessages(true);
    } catch (error) {
      console.log(error);
    }
  };


  return (
    <Box
      onContextMenu={(event) => {
        event.preventDefault();
        handleMenuOpen(event);
      }}
      sx={{
        background: isCurrent ? "#EDEDED" : "transparent",
        padding: "0.5rem 1rem",
        width: { md: "18rem", xs: "100%", sm: "100%" },
        cursor: "pointer",
        borderRadius: "0.7rem",
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
            <Badge
              color="error"
              badgeContent={countUnread > 0 ? countUnread : null}
              overlap="circular"
              invisible={countUnread === 0}
            >
              <Badge
              color="info"
                invisible={chat?.type === "private"}
                badgeContent={<GroupsIcon sx={{fontSize:"1rem"}}/>}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
              >
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
              </Badge>
            </Badge>
            <Stack>
              <Typography
                variant="h8"
                sx={{
                  fontWeight: 550,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  width: {md: "10rem", sm:"20rem", xs:"10rem"},
                }}
              >
                {chat?.chat_name ? chat?.chat_name : chatName}
              </Typography>
              <Stack direction="row" gap={0.5} alignItems="center">
                <Typography
                  sx={{
                    color: countUnread === 0 ? "#5e5e5e" : "#000",
                    fontSize: "0.7rem",
                    fontWeight: 600,
                  }}
                >
                  {chat?.last_message?.messId?.sender_id?.name}
                </Typography>

                <Typography
                  sx={{
                    color: countUnread === 0 ? "#5e5e5e" : "#000",
                    fontSize: "0.7rem",
                    fontWeight: countUnread === 0 ? 400 : 600,
                    maxWidth: "5rem",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {lastMessage}
                </Typography>
              </Stack>
            </Stack>
          </Stack>
          <Typography sx={{ fontSize: "0.8rem" }}>
            {moment(chat?.updatedAt).format("LT")}
          </Typography>
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
              horizontal: "left",
            }}
          >
            <MenuItem onClick={handleDeleteMessage}>Delete messages</MenuItem>
          </Menu>
        </Stack>
      )}
    </Box>
  );
};

export default memo(ChatItem);
