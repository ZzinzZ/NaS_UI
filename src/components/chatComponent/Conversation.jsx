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
  Button,
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
import { toast } from "react-toastify";
import { useStringee } from "@/contexts/StringeeContext";
import { findMessageByKeyword } from "@/utils/services/messageService/message.service";
import SearchInput from "./SearchInput";
import { getChatDetails } from "@/utils/services/chatService/chatService";
import CircularProgress from "@mui/material/CircularProgress";

const drawerWidth = 240;

const Conversation = ({ isDeleteMessages }) => {
  const searchParams = useSearchParams();
  const chatId = searchParams.get("chat-id");
  const [isActive, setIsActive] = useState(false);
  // const [chat, setChat] = useState();
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
  const { user = null } = useSelector((state) => state.auth ?? {});

  const {
    onlineUsers,
    newMessage,
    messages,
    reactedMessage,
    chatDeleted,
    kickChat,
    handleSendHello,
    typing,
    loadMoreChatMessage,
    hasMore,
    blockedChat,
    chat,
    setChat,
    messageLoading,
  } = useSocket();
  const { makeCall } = useStringee();
  const router = useRouter();
  const lastMessageRef = useRef(null);
  const messageRefs = useRef({});
  const conversationRef = useRef(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const handleDrawerOpen = () => setOpen(!open);
  const handleDrawerClose = () => setOpen(false);

  const theme = useTheme();
  const isTabletOrPhone = useMediaQuery(theme.breakpoints.down("md"));

  const scrollToMessage = (messageId) => {
    if (messageRefs.current[messageId]) {
      messageRefs.current[messageId].scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  const getChat = async (chatId) => {
    try {
      const response = await getChatDetails({ chatId });
      setChat(response?.chat);
    } catch (error) {
      toast.error("Chat not found!");
      router.push("/user");
    }
  };

  useEffect(() => {
    if (!chat) {
      getChat(chatId);
    }
  }, [chat]);

  useEffect(() => {
    return () => {
      setChat(null);
    };
  }, []);

  useEffect(() => {
    if (chat?.type === "group") {
      const otherParticipants = chat?.participants.filter(
        (participant) => participant.userId?._id !== user?._id
      );
      const isChatActive = otherParticipants.some((participant) =>
        onlineUsers.some(
          (onlineUser) => onlineUser.userId === participant.userId?._id
        )
      );
      setIsActive(isChatActive);
      if (
        !chat?.participants.some(
          (participant) => participant?.userId?._id === user?._id
        ) &&
        !chat?.participants.some(
          (participant) => participant?.userId === user?._id
        )
      ) {
        router.push("/user");
      }
    }

    if (chat?.type === "private") {
      const otherParticipant = chat?.participants?.find(
        (participant) => participant?.userId?._id !== user._id
      );

      setOtherParticipant(otherParticipant);
      const isChatActive = onlineUsers?.some(
        (onlineUser) => onlineUser?.userId === otherParticipant?.userId?._id
      );
      setIsActive(isChatActive);
    }
  }, [onlineUsers, chat]);

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
        otherParticipant?.userId?.profileId?.blockedBy?.some(
          (block) => block.userId === user?._id
        )
      );
      setIsBlockedBy(
        otherParticipant?.userId?.profileId?.blockedUsers?.some(
          (block) => block.userId === user?._id
        )
      );
      setStranger(
        !otherParticipant?.userId?.profileId?.friends?.some(
          (friend) => friend.userId === user?._id
        )
      );
    }
    if (chat?.type === "group") {
      setStranger(false);
    }
  }, [otherParticipant, chat]);

  useEffect(() => {
    setIsBlockedBy(blockedChat === chat?._id);
    return;
  }, [blockedChat]);

  const handleMakeVoiceCall = () => {
    if (isBlockedBy) {
      toast.error("You are blocked by this user");
      return;
    }
    if (otherParticipant) {
      makeCall(user?._id, otherParticipant?.userId?._id, false);
    }
  };

  const handleMakeVideoCall = () => {
    if (isBlockedBy) {
      toast.error("You are blocked by this user");
      return;
    }
    if (otherParticipant) {
      makeCall(user?._id, otherParticipant?.userId?._id, true);
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

  const handleLoadMore = useCallback(() => {
    if (hasMore && chatId && user?._id) {
      loadMoreChatMessage(chatId, user._id);
    }
  }, [hasMore, chatId, user?._id, loadMoreChatMessage]);

  return (
    <Box
      sx={{
        width: "100%",
      }}
    >
      <Stack
        sx={{
          width: open ? `calc(100% - ${drawerWidth}px)` : "100%",
          height: { md: "100vh", sm: "100vh", xs: "100vh" },
          transition: "width 0.3s ease-out",
          backgroundImage:
            chat?.background !== "" ? `url(${chat?.background})` : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <Box
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 1,
            background: "rgba(255, 255, 255, 0.4)",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
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
                      ? otherParticipant?.userId?.profileId.avatar?.content
                          ?.media[0].media_url
                      : chat?.avatar
                  }
                />
              ) : (
                <Avatar
                  sx={{ width: 50, height: 50 }}
                  src={
                    chat?.type === "private"
                      ? otherParticipant?.userId?.profileId.avatar?.content
                          ?.media[0].media_url
                      : chat?.avatar
                  }
                />
              )}
              <Stack>
                <Stack direction="row" spacing={1}>
                  <Typography sx={{ fontWeight: 600 }}>
                    {chat?.chat_name !== null
                      ? chat?.chat_name
                      : otherParticipant?.userId?.name}
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
            padding: { md: "1rem", sm: "0.5rem", xs: "0.2rem" },
            backgroundColor:
              chat?.background !== "" ? `transparent` : "#f1f2f6",
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
          {messageLoading ? (
            <Stack justifyContent="center" alignItems="center" sx={{ width: "100%" }}>
              <CircularProgress />
            </Stack>
          ) : (
            <>
              {hasMore && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    marginBottom: "1rem",
                  }}
                >
                  <Button onClick={handleLoadMore} disabled={!hasMore}>
                    Load More
                  </Button>
                </Box>
              )}
              {messages?.length === 0 ? (
                <Box
                  display="flex"
                  flexDirection="column"
                  justifyContent="center"
                  alignItems="center"
                  height="100%"
                  textAlign="center"
                  color="#000"
                  sx={{ opacity: 0.7, backgroundColor: "transparent" }}
                >
                  <Typography variant="h5" gutterBottom>
                    No messages yet!
                  </Typography>
                  <Typography variant="body1">
                    Send the first message to start the conversation 🎉
                  </Typography>
                  <button
                    className="btn-17"
                    onClick={() => handleSendHello(user?._id, chat?._id)}
                  >
                    <span className="text-container">
                      <span className="text">Hello 🙌</span>
                    </span>
                  </button>
                </Box>
              ) : (
                <>
                  {isSearching ? (
                    <Box sx={{ margin: "2rem 0" }}>
                      <Box className="loader"></Box>
                    </Box>
                  ) : (
                    messages?.map((message) => (
                      <Message
                        key={message?._id}
                        scrollToMessage={scrollToMessage}
                        ref={(el) => {
                          if (el) {
                            messageRefs.current[message?._id] = el;
                          }
                        }}
                        message={message}
                        setRefMessage={setRefMessage}
                        isBlockedBy={isBlockedBy}
                        isSearchResult={searchResults?.some(
                          (result) => result?._id === message?._id
                        )}
                        isCurrentSearchResult={
                          searchResults[currentSearchIndex]?._id ===
                          message?._id
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
                </>
              )}
            </>
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
        {typing?.filter((t) => t.chatId === chatId)?.length > 0 && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              borderRadius: "0.5rem",
              padding: "0.5rem 1rem",
              marginTop: "0.5rem",
              maxWidth: "fit-content",
              backgroundColor: "transparent",
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
              {typing
                .filter((t) => t.chatId === chatId)
                .map((t) => t.user.name)
                .join(", ")}{" "}
              {typing.filter((t) => t.chatId === chatId).length === 1
                ? "is"
                : "are"}{" "}
              typing...
            </Typography>
            <style>
              {`
        @keyframes typingAnimation {
          0% { transform: scale(1); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
        .btn-17 {
          background: rgb(251, 33, 117);
          background: linear-gradient(0deg, rgba(251, 33, 117, 1) 0%, rgba(234, 76, 137, 1) 100%);
          border: none;
          z-index: 1;
        }
        .btn-17:after {
          position: absolute;
          content: "";
          width: 100%;
          height: 0;
          bottom: 0;
          left: 0;
          z-index: -1;
          background: rgb(251, 33, 117);
          background: linear-gradient(0deg, rgba(234, 76, 137, 1) 0%, rgba(251, 33, 117, 1) 100%);
          transition: all 0.3s ease;
        }
        .btn-17:hover {
          color: #fff;
        }
        .btn-17:hover:after {
          top: 0;
          height: 100%;
        }
        .btn-17:active {
          top: 2px;
        }
      `}
            </style>
          </Box>
        )}
        <Box
          sx={{
            position: "sticky",
            zIndex: 1,
            background: "rgba(255, 255, 255, 0.4)",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
            backdropFilter: "blur(10px)",
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
          listMember={chat?.participants}
          setLisMember={setLisMember}
          isBlocked={isBlocked}
          setIsBlocked={setIsBlocked}
        />
      </Stack>
    </Box>
  );
};

export default Conversation;
