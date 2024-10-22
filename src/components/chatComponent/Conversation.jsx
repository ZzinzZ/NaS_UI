"use client";
import { Avatar, Box, IconButton, Stack, Typography } from "@mui/material";
import React, { useState, useEffect, useRef } from "react";
import ActiveAvatar from "./ActiveAvatar";
import CallIcon from "@mui/icons-material/Call";
import VideocamIcon from "@mui/icons-material/Videocam";
import AutoAwesomeMosaicIcon from "@mui/icons-material/AutoAwesomeMosaic";
import InputChat from "./InputChat";
import Message from "./Message";

const fakeMessages = [
  {
    _id: "64c8f3e8f5d3a3421c4d0011",
    senderId: "64c8f3e8f5d3a3421c4d1234", // Người dùng hiện tại gửi
    content: {
      text: "Hey, how are you?",
      file: null,
      image: null,
    },
    chatId: "64c8f3e8f5d3a3421c4d4567",
    react: [],
    status: {
      delivery: true,
      seen_by: ["64c8f3e8f5d3a3421c4d5678"],
      sent: true,
    },
  },
  {
    _id: "64c8f3e8f5d3a3421c4d0022",
    senderId: "64c8f3e8f5d3a3421c4d5678", // Người khác gửi
    content: {
      text: "I'm good! How about you?",
      file: null,
      image: null,
    },
    chatId: "64c8f3e8f5d3a3421c4d4567",
    react: [],
    status: {
      delivery: true,
      seen_by: ["64c8f3e8f5d3a3421c4d1234"],
      sent: true,
    },
  },
  {
    _id: "64c8f3e8f5d3a3421c4d0033",
    senderId: "64c8f3e8f5d3a3421c4d1234", // Người dùng hiện tại gửi
    content: {
      text: null,
      file: null,
      image: ["https://via.placeholder.com/150"], // Gửi hình ảnh
    },
    chatId: "64c8f3e8f5d3a3421c4d4567",
    react: [],
    status: {
      delivery: true,
      seen_by: [],
      sent: true,
    },
  },
  {
    _id: "64c8f3e8f5d3a3421c4d0044",
    senderId: "64c8f3e8f5d3a3421c4d5678", // Người khác gửi
    content: {
      text: "Check out this file.",
      file: "https://example.com/file.zip", // Gửi file
      image: null,
    },
    chatId: "64c8f3e8f5d3a3421c4d4567",
    react: [],
    status: {
      delivery: true,
      seen_by: ["64c8f3e8f5d3a3421c4d1234"],
      sent: true,
    },
  },
  {
    _id: "64c8f3e8f5d3a3421c4d0055",
    senderId: "64c8f3e8f5d3a3421c4d1234", // Người dùng hiện tại gửi
    content: {
      text: "Do you have any updates on the project?",
      file: null,
      image: null,
    },
    chatId: "64c8f3e8f5d3a3421c4d4567",
    react: [],
    status: {
      delivery: true,
      seen_by: ["64c8f3e8f5d3a3421c4d5678"],
      sent: true,
    },
  },
  {
    _id: "64c8f3e8f5d3a3421c4d0066",
    senderId: "64c8f3e8f5d3a3421c4d5678", // Người khác gửi
    content: {
      text: "Yes, the project is almost done. Here's the latest file.",
      file: "https://example.com/new-project-file.zip", // Gửi file
      image: null,
    },
    chatId: "64c8f3e8f5d3a3421c4d4567",
    react: [],
    status: {
      delivery: true,
      seen_by: ["64c8f3e8f5d3a3421c4d1234"],
      sent: true,
    },
  },
  {
    _id: "64c8f3e8f5d3a3421c4d0077",
    senderId: "64c8f3e8f5d3a3421c4d5678", // Người khác gửi
    content: {
      text: "Here are some images from the recent event.",
      file: null,
    },
    chatId: "64c8f3e8f5d3a3421c4d4567",
    react: [],
    status: {
      delivery: true,
      seen_by: ["64c8f3e8f5d3a3421c4d1234"],
      sent: true,
    },
  },
  {
    _id: "64c8f3e8f5d3a3421c4d0088",
    senderId: "64c8f3e8f5d3a3421c4d1234", // Người dùng hiện tại gửi
    content: {
      text: "Wow! These look great!",
      file: null,
      image: null,
    },
    chatId: "64c8f3e8f5d3a3421c4d4567",
    react: [],
    status: {
      delivery: true,
      seen_by: ["64c8f3e8f5d3a3421c4d5678"],
      sent: true,
    },
  },
  {
    _id: "64c8f3e8f5d3a3421c4d0099",
    senderId: "64c8f3e8f5d3a3421c4d5678", // Người khác gửi
    content: {
      text: "Glad you liked them! Let's plan the next event soon.",
      file: null,
      image: null,
    },
    chatId: "64c8f3e8f5d3a3421c4d4567",
    react: [],
    status: {
      delivery: true,
      seen_by: ["64c8f3e8f5d3a3421c4d1234"],
      sent: true,
    },
  },
  {
    _id: "64c8f3e8f5d3a3421c4d0100",
    senderId: "64c8f3e8f5d3a3421c4d1234", // Người dùng hiện tại gửi
    content: {
      text: "Definitely! I'll check my calendar.",
      file: null,
      image: null,
    },
    chatId: "64c8f3e8f5d3a3421c4d4567",
    react: [],
    status: {
      delivery: true,
      seen_by: ["64c8f3e8f5d3a3421c4d5678"],
      sent: true,
    },
  },
];

const Conversation = () => {
  const [isActive, setIsActive] = useState(true);
  const lastMessageRef = useRef(null);

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [fakeMessages]);

  return (
    <Box sx={{ width: "100%" }}>
      <Stack sx={{ width: "100%", height: "100vh" }}>
        {/*Conversation header*/}
        <Box sx={{ position: "sticky", top: 0, zIndex: 1, background: "#fff" }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ padding: "0.8rem" }}
          >
            <Stack spacing={1} direction="row">
              {isActive ? <ActiveAvatar /> : <Avatar />}
              <Stack>
                <Typography sx={{ fontWeight: 600 }}>UserName</Typography>
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
              <IconButton>
                <AutoAwesomeMosaicIcon sx={{ color: "#1976d3" }} />
              </IconButton>
            </Stack>
          </Stack>
        </Box>
        {/*Conversation center*/}
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
          {fakeMessages?.map((message, index) => {
            const isLastMessage = index === fakeMessages.length - 1;
            return (
              <Message
                key={message._id}
                message={message}
                ref={isLastMessage ? lastMessageRef : null}
              />
            );
          })}
          {/* Tạo một div trống để đảm bảo việc scroll đến phần tử cuối */}
          <Box ref={lastMessageRef} />
        </Box>
        {/*Conversation input*/}
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
      </Stack>
    </Box>
  );
};

export default Conversation;
