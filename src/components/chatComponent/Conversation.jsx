"use client";
import {
  Avatar,
  Box,
  IconButton,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
  Fab,
  Badge,
} from "@mui/material";
import React, { useState, useEffect, useRef, useCallback } from "react";
import ActiveAvatar from "./ActiveAvatar";
import CallIcon from "@mui/icons-material/Call";
import VideocamIcon from "@mui/icons-material/Videocam";
import AutoAwesomeMosaicIcon from "@mui/icons-material/AutoAwesomeMosaic";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import InputChat from "./InputChat";
import { useDispatch, useSelector } from "react-redux";
import ChatDrawer from "./ChatDrawer";
import { useSocket } from "@/contexts/SocketContext";
import Message from "./Message";
import { useRouter, useSearchParams } from "next/navigation";
import { getChatDetails } from "@/redux/thunks/chatThunk";
import { toast } from "react-toastify";
import { useStringee } from "@/contexts/StringeeContext";
import { findMessageByKeyword } from "@/utils/services/messageService/message.service";
import SearchInput from "./SearchInput";

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
  const [searchResults, setSearchResults] = useState([]);
  const [currentSearchIndex, setCurrentSearchIndex] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const {
    onlineUsers,
    newMessage,
    messages,
    reactedMessage,
    chatDeleted,
    kickChat,
    handleSendHello,
    typing,
  } = useSocket();
  const { makeCall } = useStringee();
  const dispatch = useDispatch();
  const router = useRouter();
  const lastMessageRef = useRef(null);
  const messageRefs = useRef({});
  const conversationRef = useRef(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const handleDrawerOpen = () => setOpen(!open);
  const handleDrawerClose = () => setOpen(false);

  const theme = useTheme();
  const isTabletOrPhone = useMediaQuery(theme.breakpoints.down("md"));

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
      if (
        !chat?.participants.some(
          (participant) => participant.userId === user?._id
        )
      ) {
        router.push("/user");
      }
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
    if (chat?.type === "private") {
      setIsBlocked(
        otherParticipant?.blockedBy?.some((block) => block.userId === user?._id)
      );
      setIsBlockedBy(
        otherParticipant?.blockedUsers?.some(
          (block) => block.userId === user?._id
        )
      );
      setStranger(
        !otherParticipant?.friends?.some(
          (friend) => friend.userId === user?._id
        )
      );
    }
    if (chat?.type === "group") {
      setStranger(false);
    }
  }, [otherParticipant, chat]);

  const handleMakeVoiceCall = () => {
    if (isBlockedBy) {
      toast.error("You are blocked by this user");
      return;
    }
    if (otherParticipant) {
      makeCall(user?._id, otherParticipant?.userId, false);
    }
  };

  const handleMakeVideoCall = () => {
    if (isBlockedBy) {
      toast.error("You are blocked by this user");
      return;
    }
    if (otherParticipant) {
      makeCall(user?._id, otherParticipant?.userId, true);
    }
  };

  const handleBackToChatBar = () => {
    router.push("/user");
  };

  const handleScroll = useCallback(() => {
    if (conversationRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = conversationRef.current;
      const bottomThreshold = 100; // pixels from bottom
      setShowScrollButton(
        scrollHeight - scrollTop - clientHeight > bottomThreshold
      );
    }
  }, []);

  const scrollToBottom = useCallback(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  useEffect(() => {
    const currentRef = conversationRef.current;
    if (currentRef) {
      currentRef.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (currentRef) {
        currentRef.removeEventListener("scroll", handleScroll);
      }
    };
  }, [handleScroll]);

  useEffect(() => {
    if (chatDeleted === chat?._id) {
      handleBackToChatBar();
    }
  }, [chatDeleted]);

  useEffect(() => {
    if (
      kickChat?.chat?._id === chat?._id &&
      kickChat?.kickedUser === user?._id
    ) {
      handleBackToChatBar();
    }
  }, [kickChat]);

  const handleSearch = async (keyword) => {
    if (!chatId) return;
    setIsSearching(true);
    try {
      const results = await findMessageByKeyword({ chatId, keyword });
      setSearchResults(results);
      setCurrentSearchIndex(0);
      if (results.length > 0) {
        scrollToMessage(results[0]._id);
      } else {
        toast.info("No messages found");
      }
    } catch (error) {
      console.error("Error searching messages:", error);
      toast.error("Failed to search messages");
    } finally {
      setIsSearching(false);
    }
  };

  const handleClearSearch = () => {
    setSearchResults([]);
    setCurrentSearchIndex(0);
    setIsSearching(false);
  };

  const handleNextSearchResult = () => {
    if (currentSearchIndex < searchResults.length - 1) {
      setCurrentSearchIndex(currentSearchIndex + 1);
      scrollToMessage(searchResults[currentSearchIndex + 1]._id);
    }
  };

  const handlePreviousSearchResult = () => {
    if (currentSearchIndex > 0) {
      setCurrentSearchIndex(currentSearchIndex - 1);
      scrollToMessage(searchResults[currentSearchIndex - 1]._id);
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        marginTop: { md: 0, xs: "3rem", sm: "3rem" },
      }}
    >
      <Stack
        sx={{
          width: open ? `calc(100% - ${drawerWidth}px)` : "100%",
          height: {md: "100vh", sm: "95vh", xs:"95vh"},
          transition: "width 0.3s ease-out",
        }}
      >
        <Box
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 1,
            background: "#fff",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ padding: "0.8rem" }}
          >
            <Stack spacing={1} direction="row" alignItems="center">
              {isTabletOrPhone && (
                <IconButton onClick={handleBackToChatBar}>
                  <ChevronLeftIcon sx={{ color: "#1976d3" }} />
                </IconButton>
              )}
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
                  {stranger && (
                    <Typography
                      sx={{
                        backgroundColor: "#ccc",
                        padding: "0 0.2rem",
                        borderRadius: "0.4rem",
                      }}
                    >
                      Stranger
                    </Typography>
                  )}
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
              <SearchInput
                onSearch={handleSearch}
                onClear={handleClearSearch}
              />
              {searchResults.length > 0 && (
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography variant="body2">
                    {currentSearchIndex + 1} of {searchResults.length}
                  </Typography>
                  <IconButton
                    onClick={handlePreviousSearchResult}
                    disabled={currentSearchIndex === 0}
                  >
                    <KeyboardArrowUpIcon />
                  </IconButton>
                  <IconButton
                    onClick={handleNextSearchResult}
                    disabled={currentSearchIndex === searchResults.length - 1}
                  >
                    <KeyboardArrowDownIcon />
                  </IconButton>
                </Stack>
              )}
              {chat?.type === "private" && (
                <IconButton onClick={() => handleMakeVoiceCall()}>
                  <CallIcon sx={{ color: "#1976d3" }} />
                </IconButton>
              )}
              {chat?.type === "private" && (
                <IconButton onClick={handleMakeVideoCall}>
                  <VideocamIcon sx={{ color: "#1976d3" }} />
                </IconButton>
              )}
              <IconButton onClick={handleDrawerOpen}>
                <AutoAwesomeMosaicIcon sx={{ color: "#1976d3" }} />
              </IconButton>
            </Stack>
          </Stack>
        </Box>
        <Box sx={{ padding: "0.5rem 1rem" }}></Box>
        {/* Conversation center */}
        <Box
          ref={conversationRef}
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
          {isSearching ? (
            <Box sx={{ margin: "2rem 0" }}>
              <Box className="loader"></Box>
            </Box>
          ) : (
            messages?.map((message) => (
              <Message
                scrollToMessage={scrollToMessage}
                ref={(el) => (messageRefs.current[message?._id] = el)}
                message={message}
                key={message?._id}
                setRefMessage={setRefMessage}
                isBlockedBy={isBlockedBy}
                isSearchResult={searchResults.some(
                  (result) => result._id === message._id
                )}
                isCurrentSearchResult={
                  searchResults[currentSearchIndex]?._id === message._id
                }
              />
            ))
          )}
          <Box ref={lastMessageRef} />
          {isBlockedBy && (
            <Stack justifyContent="center" sx={{ width: "100%" }}>
              <Typography sx={{ color: "red", textAlign: "center" }}>
                Messages cannot currently be sent to this user
              </Typography>
            </Stack>
          )}
        </Box>
        {showScrollButton && (
          <Stack sx={{ width: "100%", position: "relative" }}>
            <Fab
              size="small"
              onClick={scrollToBottom}
              sx={{
                position: "absolute",
                bottom: 10,
                right: "50%",
                zIndex: 2,
                backgroundColor: "#fff",
                color: "rgba(25, 118, 211,1)",
              }}
            >
              <KeyboardArrowDownIcon />
            </Fab>
          </Stack>
        )}
        {typing?.length > 0 && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              borderRadius: "0.5rem",
              padding: "0.5rem 1rem",
              marginTop: "0.5rem",
              maxWidth: "fit-content",
            }}
          >
            <Box
              sx={{
                width: "1rem",
                height: "1rem",
                borderRadius: "50%",
                backgroundColor: "#1976d3",
                animation: "typingAnimation 1.5s infinite",
              }}
            />
            <Typography
              sx={{
                color: "#64686b",
                fontSize: "0.9rem",
                fontWeight: "500",
              }}
            >
              {typing[0]?.name} is typing...
            </Typography>
            <style>
              {`
      @keyframes typingAnimation {
        0% { transform: scale(1); }
        50% { transform: scale(1.2); }
        100% { transform: scale(1); }
      }
    `}
            </style>
          </Box>
        )}
        <Box
          sx={{
            position: "sticky",
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
