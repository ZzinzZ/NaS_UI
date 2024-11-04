import { Avatar, Box, IconButton, Stack, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import AddReactionIcon from '@mui/icons-material/AddReaction';
import ReplyIcon from "@mui/icons-material/Reply";

const Message = ({ message }) => {
  const currentUserId = "64c8f3e8f5d3a3421c4d1234";
  const isSentByCurrentUser = message.senderId === currentUserId;

  // State để điều khiển hover
  const [hover, setHover] = useState(false);

  return (
    <Stack
      direction="row"
      justifyContent={isSentByCurrentUser ? "flex-end" : "flex-start"}
      sx={{
        padding: "0.5rem",
      }}
    >
      <Stack direction="row" spacing={1} alignItems="end">
        {!isSentByCurrentUser && <Avatar />}
        <Stack>
          {!isSentByCurrentUser && <Typography>UserName</Typography>}
          <Box
            sx={{
              backgroundColor: isSentByCurrentUser ? "#1976d3" : "#fff",
              color: isSentByCurrentUser ? "#fff" : "#000",
              padding: "0.8rem",
              borderRadius: "10px",
              position: "relative", // Để chứa các icon nút ở góc
              wordWrap: "break-word",
              "&:hover .message-icons": {
                opacity: 1, // Hiển thị icon khi hover
              },
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            }}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            {/* Hiển thị nội dung tin nhắn */}
            <Stack sx={{ width: "100%" }}>
              {message.content.text && (
                <Typography>{message.content.text}</Typography>
              )}

              {message.content.image && (
                <Image
                  src={message.content.image}
                  alt="message"
                  width={100}
                  height={100}
                />
              )}

              {message.content.file && (
                <Link href={message.content.file} download>
                  Download File
                </Link>
              )}
              <Typography sx={{ color: "#ccc", fontSize: "0.7rem" }}>
                11:20
              </Typography>
            </Stack>

            {/* Nút React và Reply */}
            <Box
              className="message-icons"
              sx={{
                position: "absolute",
                bottom: "0",
                right: isSentByCurrentUser ? "auto" : "-4.7rem",
                left: isSentByCurrentUser ? "-4.7rem" : "auto",
                display: "flex",
                gap: "0.5rem",
                opacity: 0,
                transition: "opacity 0.3s ease-in-out",
              }}
            >
              <IconButton size="small" sx={{ color: "#666" }}>
                <AddReactionIcon />
              </IconButton>
              <IconButton size="small" sx={{ color: "#666" }}>
                <ReplyIcon />
              </IconButton>
            </Box>
          </Box>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default Message;
