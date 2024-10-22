"use client";
import { Avatar, Box, Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import ActiveAvatar from "./ActiveAvatar";

const ChatItem = () => {
  const [isCurrent, setIsCurrent] = useState(false);
  const [isActive, setIsActive] = useState(true);
  return (
    <Box
      sx={{
        background: isCurrent ? "#EDEDED" : "transparent",
        padding: "0.5rem 1rem",
        cursor: "pointer",
        "&:hover": {
            backgroundColor: "#EDEDED !important",
        }
      }}
    >
      <Stack direction="row" spacing={1} alignItems="center">
        {isActive ? <ActiveAvatar /> : <Avatar />}
        <Stack>
          <Typography variant="h8" sx={{ fontWeight: 550 }}>
            UserName
          </Typography>
          <Typography
            sx={{ color: "#5e5e5e", fontSize: "0.8rem", fontWeight: 400 }}
          >
            Chat message
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
};

export default ChatItem;
