"use client";
import React from "react";
import { Box, Stack, Typography, IconButton } from "@mui/material";
import CallEndIcon from "@mui/icons-material/CallEnd";
import PhoneInTalkIcon from "@mui/icons-material/PhoneInTalk";
import VideocamIcon from "@mui/icons-material/Videocam";
const ComingCall = ({
  callerName,
  isIncomingCall,
  onAnswer,
  onReject,
  onEnd,
}) => {
  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 20,
        right: 20,
        width: 300,
        background: "#fff",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        borderRadius: "10px",
        padding: "1rem",
        zIndex: 1300,
      }}
    >
      <Typography variant="h6" textAlign="center">
        {isIncomingCall ? `${callerName} đang gọi...` : "Cuộc gọi đang diễn ra"}
      </Typography>

      <Stack direction="row" justifyContent="center" spacing={2} mt={2}>
        {isIncomingCall ? (
          <>
            <IconButton
              onClick={onAnswer}
              sx={{ backgroundColor: "#4caf50", color: "#fff" }}
            >
              <PhoneInTalkIcon />
            </IconButton>
            <IconButton
              onClick={onReject}
              sx={{ backgroundColor: "#f44336", color: "#fff" }}
            >
              <CallEndIcon />
            </IconButton>
          </>
        ) : (
          <IconButton
            onClick={onEnd}
            sx={{ backgroundColor: "#f44336", color: "#fff" }}
          >
            <CallEndIcon />
          </IconButton>
        )}
      </Stack>
    </Box>
  );
};

export default ComingCall;
