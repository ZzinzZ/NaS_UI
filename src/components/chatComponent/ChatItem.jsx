"use client";
import { Avatar, Box, IconButton, Menu, MenuItem, Stack, Typography } from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import React, { useEffect, useState } from "react";
import ActiveAvatar from "./ActiveAvatar";
import { useSearchParams } from "next/navigation";
import { disconnectSocket, initiateSocketConnection, subscribeToOnlineStatus } from "@/utils/services/socket/socketService";
import { useSelector } from "react-redux";

const ChatItem = ({ chat, onDeleteMessage, onPinMessage }) => {
  const [isCurrent, setIsCurrent] = useState(false);
  const [isActive, setIsActive] = useState(false); 
  const [anchorEl, setAnchorEl] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState({});
  const searchParams = useSearchParams();
  const chatId = searchParams.get("chat-id");
  const {user} = useSelector(state => state.auth)

  useEffect(() => {
    setIsCurrent(chat._id.toString() === chatId);
  }, [chatId]);

  useEffect(() => {
    subscribeToOnlineStatus((userId, isOnline) => {
      setOnlineUsers((prev) => ({
        ...prev,
        [userId]: isOnline,
      }));
    });
    console.log(onlineUsers);
    
  }, []);

  useEffect(() => {
    initiateSocketConnection(user._id);  
    return () => {
        disconnectSocket();
    };
}, [user._id]);

  useEffect(() => {
    let isChatActive = false;
  
    if (chat.type === "group") {
      isChatActive = chat.participants.some(
        (participant) => onlineUsers[participant.userId] === true
      );
    } else if (chat.type === "private") {
      const otherParticipant = chat.participants.find(
        (participant) => participant.userId !== user._id
      );
      const participantId = otherParticipant.userId;
      console.log(onlineUsers);
      
      if (otherParticipant) {
        isChatActive = onlineUsers?.participantId === true;
        console.log(onlineUsers);
        
      }
    }
  
    setIsActive(isChatActive);
    console.log(
      `${chat.chat_name} is ${isChatActive ? "online" : "offline"}`
    );
  }, [onlineUsers, chat, user._id]);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteMessage = () => {

  };

  const handlePinMessage = () => {

  };

  return (
    <Box
      sx={{
        background: isCurrent ? "#EDEDED" : "transparent",
        padding: "0.5rem 1rem",
        cursor: "pointer",
        "&:hover": {
          backgroundColor: "#EDEDED !important",
        },
      }}
    >
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        justifyContent="space-between"
      >
        <Stack direction="row" spacing={1} alignItems="center">
          {isActive ? (
            <ActiveAvatar image_url={chat?.avatar} />
          ) : (
            <Avatar sx={{ width: 50, height: 50 }} src={chat?.avatar} />
          )}
          <Stack>
            <Typography
              variant="h8"
              sx={{
                fontWeight: 550,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: "150px", 
              }}
            >
              {chat?.chat_name}
            </Typography>
            <Typography
              sx={{ color: "#5e5e5e", fontSize: "0.8rem", fontWeight: 400 }}
            >
              Chat message
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
    </Box>
  );
};

export default ChatItem;
