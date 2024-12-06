"use client";
import React, { useEffect, useState } from "react";
import { Box, Stack, Typography, IconButton } from "@mui/material";
import CallEndIcon from "@mui/icons-material/CallEnd";
import VideocamIcon from "@mui/icons-material/Videocam";

const CallWindow = ({ callerName, onEnd }) => {
  const [callDuration, setCallDuration] = useState(0);

  // Hàm định dạng thời gian thành phút:giây
  const formatTime = (duration) => {
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  // Bắt đầu đếm thời gian cuộc gọi
  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <Box
      sx={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 400,
        height: 600,
        background: "#2E2E2E",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        borderRadius: "20px",
        padding: "1rem",
        zIndex: 1300,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        color: "#fff",
      }}
    >
      {/* Hiển thị thông tin người gọi */}
      <Typography variant="h6" textAlign="center" sx={{ marginTop: "1rem" }}>
        Cuộc gọi với {callerName}
      </Typography>

      {/* Đồng hồ hiển thị thời gian cuộc gọi */}
      <Typography variant="h5" sx={{ marginTop: "2rem" }}>
        Thời gian: {formatTime(callDuration)}
      </Typography>

      {/* Vùng để phát âm thanh cục bộ và âm thanh từ xa */}
      <Stack
        direction="row"
        justifyContent="center"
        spacing={2}
        mt={2}
        sx={{ marginTop: "2rem" }}
      >
        <audio id="localAudio" autoPlay playsInline hidden></audio>
        <audio id="remoteAudio" autoPlay playsInline hidden></audio>
      </Stack>

      {/* Nút kết thúc cuộc gọi */}
      <Stack direction="row" justifyContent="center" spacing={2} mt={4}>
        <IconButton
          onClick={onEnd}
          sx={{
            backgroundColor: "#f44336",
            color: "#fff",
            width: "60px",
            height: "60px",
          }}
        >
          <CallEndIcon />
        </IconButton>
      </Stack>
    </Box>
  );
};

export default CallWindow;
