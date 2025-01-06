"use client";
import { Badge, IconButton, Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import ChatIcon from "@mui/icons-material/Chat";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import moment from "moment";
import { useRouter } from "next/navigation";
import { deleteNotification, markNotificationAsRead } from "@/utils/services/notification/notification.service";
import { useSocket } from "@/contexts/SocketContext";

const NotificationItem = ({ notify }) => {
  const router = useRouter();
  const {setNotifications,notifications} = useSocket();
  const [isSeen, setIsSeen]= useState(notify?.seen);

  const handleClick = async () => {
    setIsSeen(true);
    if(notify?.type === 'chat' && notify?.refChat !== null){
      router.push(`/user?chat-id=${notify?.refChat?._id}`)
    }
    else{
      router.push(`/user/profile?id=${notify?.refUser?._id}`)
    }
    if(!notify?.seen) {
      const res = await markNotificationAsRead({notificationId: notify?._id});
      const updatedNotifications = notifications.map((notification) => 
        notification._id === notify?._id ? res : notification
      );

      setNotifications(updatedNotifications);
    }
  }

  const handleDeleteNotification = async () => {
    await deleteNotification({notificationId: notify?._id});
    setNotifications(prev => prev.filter(n => n._id!== notify?._id));
  }
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{
        background: !isSeen ? "rgba(25, 118, 211, 0.1)" : "#fff",
        padding: "0.75rem",
        borderRadius: "0.5rem",
        marginBottom: "0.5rem",
        cursor: "pointer",
        transition: "background 0.3s ease",
        "&:hover": {
          backgroundColor: "rgba(0, 0, 0, 0.05)",
        },
      }}
      
    >
      <Stack direction="row" alignItems="center" spacing={1.5} onClick={handleClick}> 
        <Badge variant="dot" invisible={isSeen} color="primary">
          {notify?.type === "chat" ? (
            <ChatIcon sx={{ color: "rgba(0,0,0,0.7)" }} />
          ) : (
            <AccountBoxIcon sx={{ color: "rgba(0,0,0,0.7)" }} />
          )}
        </Badge>
        <Stack>
          <Typography
            sx={{
              fontSize: "0.9rem",
              fontWeight: isSeen ? 400 : 600,
              color: isSeen ? "rgba(0,0,0,0.7)" : "rgba(0,0,0,1)",
            }}
          >
            {notify?.message}
          </Typography>
          <Typography
            sx={{
              fontSize: "0.75rem",
              color: "rgba(0,0,0,0.6)",
              marginTop: "0.2rem",
            }}
          >
            {moment(notify?.createdAt).fromNow()}
          </Typography>
        </Stack>
      </Stack>
      <IconButton onClick={handleDeleteNotification}>
        <DeleteOutlineIcon
          sx={{ fontSize: "1rem", color: "rgba(0,0,0,0.6)" }}
        />
      </IconButton>
    </Stack>
  );
};

export default NotificationItem;
