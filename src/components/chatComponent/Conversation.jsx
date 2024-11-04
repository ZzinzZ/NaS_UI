"use client";
import {
  Avatar,
  Box,
  Button,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import React, { useState, useEffect, useRef } from "react";
import ActiveAvatar from "./ActiveAvatar";
import CallIcon from "@mui/icons-material/Call";
import VideocamIcon from "@mui/icons-material/Videocam";
import AutoAwesomeMosaicIcon from "@mui/icons-material/AutoAwesomeMosaic";
import InputChat from "./InputChat";
import { getChatDetails } from "@/utils/services/chatService/chatService";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import ChatDrawer from "./ChatDrawer";

const drawerWidth = 240;

const Conversation = ({ chatId }) => {
  const [isActive, setIsActive] = useState(true);
  const [chat, setChat] = useState();
  const [open, setOpen] = useState(false);
  const [listMember, setLisMember] = useState([]);
  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);
  const { user } = useSelector((state) => state.auth);

  const lastMessageRef = useRef(null);

  const chatDetails = async (chatId) => {
    try {
      const response = await getChatDetails({ chatId: chatId });
      setChat(response?.chat);
      setLisMember(response?.participantProfiles);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
    chatDetails(chatId);
  }, [chatId]);

  return (
    <Box
      sx={{
        width: "100%",
      }}
    >
      <Stack
        sx={{
          width: open ? `calc(100% - ${drawerWidth}px)` : "100%",
          height: "100vh",
          transition: "width 0.3s ease-out",
        }}
      >
        {/* Conversation header */}
        <Box sx={{ position: "sticky", top: 0, zIndex: 1, background: "#fff" }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ padding: "0.8rem" }}
          >
            <Stack spacing={1} direction="row">
              {isActive ? (
                <ActiveAvatar image_url={chat?.avatar} />
              ) : (
                <Avatar src={chat?.avatar} />
              )}
              <Stack>
                <Typography sx={{ fontWeight: 600 }}>
                  {chat?.chat_name}
                </Typography>
                <Typography
                  sx={{
                    fontWeight: 400,
                    color: isActive ? "#44b700" : "#ccc",
                    fontSize: "0.7rem",
                  }}
                >
                  {isActive ? "online" : "offline"}
                </Typography>
              </Stack>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <IconButton>
                <CallIcon sx={{ color: "#1976d3" }} />
              </IconButton>
              <IconButton>
                <VideocamIcon sx={{ color: "#1976d3" }} />
              </IconButton>
              <IconButton onClick={handleDrawerOpen}>
                <AutoAwesomeMosaicIcon sx={{ color: "#1976d3" }} />
              </IconButton>
            </Stack>
          </Stack>
        </Box>
        {/* Conversation center */}
        <Box
          sx={{
            flexGrow: 1,
            overflowY: "auto",
            padding: "1rem",
            backgroundColor: "#f1f2f6",
            "&::-webkit-scrollbar": {
              width: "6px",
              height: "6px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#bfbfbf",
              borderRadius: "10px",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              backgroundColor: "#a1a1a1",
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "#f1f1f1",
              borderRadius: "10px",
            },
          }}
        >
          <Box ref={lastMessageRef} />
        </Box>
        {/* Conversation input */}
        <Box
          sx={{
            position: "sticky",
            bottom: { xs: "3rem", sm: "3rem", md: 0 },
            zIndex: 1,
            background: "#fff",
          }}
        >
          <InputChat />
        </Box>
        <ChatDrawer
          open={open}
          handleDrawerClose={handleDrawerClose}
          chat={chat}
          onUpdate={setChat}
          listMember={listMember}
          setLisMember={setLisMember}
        />
      </Stack>
    </Box>
  );
};

export default Conversation;
