"use client";
import { Avatar, Box, IconButton, Stack, Typography } from "@mui/material";
import React, { useState, useEffect, useRef } from "react";
import ActiveAvatar from "./ActiveAvatar";
import CallIcon from "@mui/icons-material/Call";
import VideocamIcon from "@mui/icons-material/Videocam";
import AutoAwesomeMosaicIcon from "@mui/icons-material/AutoAwesomeMosaic";
import InputChat from "./InputChat";
import { useDispatch, useSelector } from "react-redux";
import ChatDrawer from "./ChatDrawer";
import { useSocket } from "@/contexts/SocketContext";
import Message from "./Message";
import { useSearchParams } from "next/navigation";
import { getChatDetails } from "@/redux/thunks/chatThunk";
import { toast } from "react-toastify";

const drawerWidth = 240;

const Conversation = ({ isDeleteMessages }) => {
  const searchParams = useSearchParams();
  const chatId = searchParams.get("chat-id");
  const [isActive, setIsActive] = useState(false);
  const [chat, setChat] = useState();
  const [open, setOpen] = useState(false);
  const [listMember, setLisMember] = useState([]);
  const [otherParticipant, setOtherParticipant] = useState();
  const [refMessage, setRefMessage] = useState(null);
  const [isBlocked, setIsBlocked] = useState(false);
  const [isBlockedBy, setIsBlockedBy] = useState(false);
  const [stranger, setStranger] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const { onlineUsers, newMessage, messages, reactedMessage } = useSocket();
  const dispatch = useDispatch();
  const lastMessageRef = useRef(null);
  const messageRefs = useRef({});
  const handleDrawerOpen = () => setOpen(!open);
  const handleDrawerClose = () => setOpen(false);

  const chatDetails = async () => {
    try {
      const response = await dispatch(getChatDetails({ chatId })).unwrap();

      setChat(response?.chat);
      setLisMember(response?.participantProfiles || []);
    } catch (error) {
      toast.error("Không thể lấy chi tiết cuộc trò chuyện:", error);
    }
  };

  const scrollToMessage = (messageId) => {
    if (messageRefs.current[messageId]) {
      messageRefs.current[messageId].scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  useEffect(() => {
    if (chat?.type === "group") {
      const otherParticipants = chat?.participants.filter(
        (participant) => participant.userId !== user?._id
      );
      const isChatActive = otherParticipants.some((participant) =>
        onlineUsers.some(
          (onlineUser) => onlineUser.userId === participant.userId
        )
      );
      setIsActive(isChatActive);
    }
    if (chat?.type === "private") {
      const otherParticipant = chat.participants.find(
        (participant) => participant.userId !== user._id
      );
      setOtherParticipant(
        listMember?.find(
          (participant) => participant.userId === otherParticipant.userId
        )
      );
      const isChatActive = onlineUsers.some(
        (onlineUser) => onlineUser.userId === otherParticipant.userId
      );
      setIsActive(isChatActive);
    }
  }, [onlineUsers, chat]);

  useEffect(() => {
    if (chatId !== undefined) {
      const timeoutId = setTimeout(() => {
        chatDetails(chatId);
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [chatId, isDeleteMessages]);

  useEffect(() => {
    if (messages?.length > 0 && lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [newMessage, reactedMessage]);

  useEffect(() => {
    if(chat?.type === "private") {
      setIsBlocked(
        otherParticipant?.blockedBy?.some((block) => block.userId === user?._id)
      );
      setIsBlockedBy(
        otherParticipant?.blockedUsers?.some(
          (block) => block.userId === user?._id
        )
      );
      setStranger(!otherParticipant?.friends?.some((friend) => friend.userId === user?._id))
    }
  }, [otherParticipant, chat]);

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
        <Box sx={{ position: "sticky", top: 0, zIndex: 1, background: "#fff" , boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",}}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ padding: "0.8rem" }}
          >
            <Stack spacing={1} direction="row">
              {isActive ? (
                <ActiveAvatar
                  image_url={
                    chat?.type === "private"
                      ? otherParticipant?.avatar?.content?.media[0].media_url
                      : chat?.avatar
                  }
                />
              ) : (
                <Avatar
                  sx={{ width: 50, height: 50 }}
                  src={
                    chat?.type === "private"
                      ? otherParticipant?.avatar?.content?.media[0].media_url
                      : chat?.avatar
                  }
                />
              )}
              <Stack>
                <Stack direction="row" spacing={1}>
                <Typography sx={{ fontWeight: 600 }}>
                  {chat?.chat_name !== null
                    ? chat?.chat_name
                    : otherParticipant?.userName}
                </Typography>
                {
                  stranger && <Typography sx={{backgroundColor:"#ccc", padding:"0 0.2rem", borderRadius:"0.4rem"}}>Stranger</Typography>
                }
                </Stack>
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
          {messages?.map((message) => (
            <Message
              scrollToMessage={scrollToMessage}
              ref={(el) => (messageRefs.current[message?._id] = el)}
              message={message}
              key={message?._id}
              setRefMessage={setRefMessage}
              isBlockedBy={isBlockedBy}
            />
          ))}
          <Box ref={lastMessageRef} />
          {isBlockedBy && (
            <Stack justifyContent="center" sx={{width:"100%"}}>
              <Typography sx={{ color: "red", textAlign:"center" }}>
              Messages cannot currently be sent to this user
            </Typography>
            </Stack>
          )}
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
          <InputChat
            chat={chat}
            refMessage={refMessage}
            setRefMessage={setRefMessage}
            isBlockedBy={isBlockedBy}
          />
        </Box>
        <ChatDrawer
          open={open}
          handleDrawerClose={handleDrawerClose}
          chat={chat}
          onUpdate={setChat}
          listMember={listMember}
          setLisMember={setLisMember}
          isBlocked={isBlocked}
          setIsBlocked={setIsBlocked}
        />
      </Stack>
    </Box>
  );
};

export default Conversation;
