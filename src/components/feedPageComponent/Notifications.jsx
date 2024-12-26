"use client";
import { useSocket } from "@/contexts/SocketContext";
import { Box, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import NotificationItem from "./NotificationItem";
import NotificationsOffIcon from "@mui/icons-material/NotificationsOff";

const Notifications = () => {
  const { notifications } = useSocket();

  return (
    <Box
      sx={{
        background: "#fff",
        padding: "1rem",
        marginBottom: "1rem",
        borderRadius: "0.5rem",
        width: "100%",
        boxShadow: "0 1px 2px rgba(0,0,0,0.2)",
        display: { sm: "block", md: "block", xs: "none" },
        height: "100vh",
        overflowY: "scroll",
        "&::-webkit-scrollbar": {
          display: "none",
        },
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
    >
      <Typography variant="h6">Notifications</Typography>
      {notifications?.length > 0 ? (
        <Stack>
          {notifications?.map((notify) => (
            <NotificationItem notify={notify} key={notify?._id} />
          ))}
        </Stack>
      ) : (
        <Stack alignItems="center" justifyContent="center">
          <NotificationsOffIcon sx={{ fontSize: "3rem", color: "#ddd" }}/>
          <Typography variant="body1" sx={{ fontStyle: "italic" }}>No notification</Typography>
        </Stack>
      )}
    </Box>
  );
};

export default Notifications;
