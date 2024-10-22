import {
  Avatar,
  Box,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import React from "react";
import ActiveAvatar from "./ActiveAvatar";
import ChatItem from "./ChatItem";

const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

const ChatBar = () => {
  return (

        <Box
          sx={{
            background: "#fff",
            width: "20rem",
            height: "100vh",
            boxShadow: "0 1px 2px rgba(0,0,0,0.2)",
            display: "flex",
            flexDirection: "column",
            borderRight: "0.3px solid #bdbdbd"
          }}
        >
          <Box
            sx={{ position: "sticky", top: 0, zIndex: 1, background: "#fff" }}
          >
            <Typography variant="h6" sx={{ padding: "1rem 0 0rem 1rem" }}>
              Chats
            </Typography>
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
                <IconButton>
                  <SearchIcon sx={{ color: "#5e5e5e", fontSize: "1.5rem" }} />
                </IconButton>
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
                display: "flex",
                flexDirection: "row",
                marginBottom: "1rem",
                "&::-webkit-scrollbar": {
                  height: "6px",
                },
              }}
            >
              {array?.map((num) => (
                <Stack
                  key={num}
                  sx={{ width: "3.2rem",padding:"0.2rem", cursor: "pointer", "&:hover": {backgroundColor:"#EDEDED"}}}
                  alignItems="center"
                  justifyContent="center"
                  
                >
                  <ActiveAvatar />
                  <Typography textAlign="center" sx={{ fontSize: "0.9rem" }}>
                    User Name
                  </Typography>
                </Stack>
              ))}
            </Stack>

            {/* Phần Chat items (cuộn dọc) */}

            <Stack>
              {array?.map((num) => (
                <ChatItem key={num} />
              ))}
            </Stack>
          </Box>
        </Box>
  );
};

export default ChatBar;
