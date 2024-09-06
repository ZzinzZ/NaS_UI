"use client";
import {
  Avatar,
  Box,
  List,
  ListItem,
  ListItemButton,
  Stack,
  Typography,
} from "@mui/material";
import React from "react";

const ConversationShortcuts = () => {
  return (
    <Box
      sx={{
        width: "20vw",
        position: "fixed",
        top: "3.35rem",
        right: 0,
        height: "calc(100vh - 3.2rem)",
        overflowY: "auto",
        paddingBottom: "1rem",
        "&::-webkit-scrollbar": {
          width: "0.4rem",
          display: "none", 
        },
        "&:hover::-webkit-scrollbar": {
          display: "block",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "rgba(0, 0, 0, 0.2)",
          borderRadius: "1rem",
        },
        "&::-webkit-scrollbar-thumb:hover": {
          backgroundColor: "rgba(0, 0, 0, 0.3)",
        },
        "&::-webkit-scrollbar-track": {
          background: "transparent",
        },
      }}
    >
      <Typography sx={{ padding: "1rem", color: "#5f6871", fontWeight: 500 }}>
        Your shortcuts
      </Typography>
      <List>
        {[...Array(5)].map((_, index) => (
          <ListItem key={index}>
            <ListItemButton>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar width={30} height={30} />
                <Typography sx={{ fontWeight: 500 }}>Nhat Anh</Typography>
              </Stack>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <hr />
      <Typography sx={{ padding: "1rem", color: "#5f6871", fontWeight: 500 }}>
        Your shortcuts
      </Typography>
      <List sx={{ background: "transparent" }}>
        {[...Array(2)].map((_, index) => (
          <ListItem key={index}>
            <ListItemButton>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar width={30} height={30} />
                <Typography>Nhat Anh</Typography>
              </Stack>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default ConversationShortcuts;
