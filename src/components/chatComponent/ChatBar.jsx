import {
  Avatar,
  Box,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import React, { useEffect, useState, useCallback } from "react";
import ActiveAvatar from "./ActiveAvatar";
import ChatItem from "./ChatItem";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import {
  findChatByName,
  getChatsList,
} from "@/utils/services/chatService/chatService";
import CreateGroupBoard from "./CreateGroupBoard";
import ListChatLoading from "./ListChatLoading";
import useDebounce from "@/customHooks/useDebounce";
import { useSocket } from "@/contexts/SocketContext";
import { memo } from "react";

const ChatBar = ({ setIsDeleteMessages }) => {
  const router = useRouter();
  const { user } = useSelector((state) => state.auth);
  const [chats, setChats] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [openCreateBoard, setOpenCreateBoard] = useState(false);
  const [isReadMessage, setIsReadMessage] = useState(false);
  const [searchText, setSearchText] = useState("");
  const debouncedSearchText = useDebounce(searchText, 300);
  const { chatBarChange, newMessage, receiveMessage,chatDeleted } = useSocket();

  const getUserChat = async () => {
    console.log("GetUserChat");
    
    try {
      const response = await getChatsList({ userId: user._id });

      setChats(response);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteChatMessages = useCallback((chatId) => {
    setChats(prevChats => prevChats.filter(chat => chat._id !== chatId));
  }, []);

  const findChat = async (keyword) => {
    try {
      if (keyword !== "") {
        const response = await findChatByName({
          chatName: keyword,
          userId: user._id,
        });
        setChats(response);
      } else {
        getUserChat();
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUserChat();
  }, [user, newMessage, receiveMessage]);

  const handleChatItemClick = useCallback((chatId) => {
    router.push(`/user?chat-id=${chatId}`);
    setIsReadMessage(true);
  }, [router]);

  const handleCreateBoardClick = useCallback(() => {
    setOpenCreateBoard(true);
  }, []);

  const handleCloseCreateBoard = useCallback(() => {
    setOpenCreateBoard(false);
  }, []);

  const handleSearchChange = useCallback((e) => {
    setSearchText(e.target.value);
  }, []);

  useEffect(() => {
    if (debouncedSearchText) {
      findChat(debouncedSearchText);
    } else {
      getUserChat();
    }
  }, [debouncedSearchText]);

  useEffect(() => {
    if(chatBarChange !== null) {
      setChats((prev) => [chatBarChange, ...prev]);
    }
  },[chatBarChange])

  useEffect(() => {
    if(chatDeleted !== null) {
      setChats(prevChats => prevChats.filter(chat => chat._id !== chatDeleted));
    }
  },[chatDeleted])


  return (
    <Box
      sx={{
        background: "#fff",
        width: { xs: "100%", md: "23rem", sm: "100%" },
        height: "100vh",
        boxShadow: "0 1px 2px rgba(0,0,0,0.2)",
        display: "flex",
        flexDirection: "column",
        borderRight: "0.3px solid #bdbdbd",
        marginTop: { md: 0, xs: "3rem", sm: "3rem" },
      }}
    >
      <CreateGroupBoard
        open={openCreateBoard}
        handleClose={handleCloseCreateBoard}
        reloadChat={getUserChat}
      />
      <Box sx={{ position: "sticky", top: 0, zIndex: 1, background: "#fff" }}>
        <Stack
          sx={{ paddingRight: "1rem" }}
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h6" sx={{ padding: "1rem 0 0rem 1rem" }}>
            Chats
          </Typography>
          <IconButton onClick={handleCreateBoardClick}>
            <GroupAddIcon />
          </IconButton>
        </Stack>
        <Box sx={{ padding: "0 1rem", marginBottom: "1rem" }}>
          <Stack
            direction="row"
            alignItems="center"
            sx={{
              borderRadius: "0.5rem",
              padding: "0 0.5rem 0 1rem",
              background: "#EAEAEA",
              height: "2.5rem",
            }}
          >
            <TextField
              autoComplete="off"
              placeholder="Search..."
              value={searchText}
              onChange={handleSearchChange}
              sx={{
                width: "100%",
                "& .MuiOutlinedInput-root": {
                  border: "none",
                  "& fieldset": {
                    border: "none",
                  },
                  "&:hover fieldset": {
                    border: "none",
                  },
                  "&.Mui-focused fieldset": {
                    border: "none",
                  },
                },
              }}
            />
            <SearchIcon sx={{ color: "#5e5e5e", fontSize: "1.5rem" }} />
          </Stack>
        </Box>
      </Box>
      <Box
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          padding: "0 1rem",
          "&::-webkit-scrollbar": {
            width: "3px",
            height: "3px",
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
        {/* Phần Potential chat (cuộn ngang) */}
        <Stack
          direction="row"
          spacing={2}
          sx={{
            padding: "0 1rem",
            overflowX: "auto",
            overflowY: "hidden",
            display: "flex",
            flexDirection: "row",
            marginBottom: "1rem",
            "&::-webkit-scrollbar": {
              height: "6px",
            },
          }}
        ></Stack>

        {/* Phần Chat items (cuộn dọc) */}

        <Stack>
          {isFetching ? (
            <ListChatLoading />
          ) : chats?.length > 0 ? (
            chats.map((chat) => (
              <Box
                key={chat?._id}
                onClick={() => handleChatItemClick(chat?._id)}
              >
                <ChatItem
                  chat={chat}
                  isReadMessage={isReadMessage}
                  setIsReadMessage={setIsReadMessage}
                  setIsDeleteMessages={setIsDeleteMessages}
                  onDeleteChatMessages={handleDeleteChatMessages}
                />
              </Box>
            ))
          ) : (
            <Typography>No conversation available</Typography>
          )}
        </Stack>
      </Box>
    </Box>
  );
};

export default memo(ChatBar);

