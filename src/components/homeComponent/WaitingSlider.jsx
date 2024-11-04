import { Box, Stack, Typography } from "@mui/material";
import Image from "next/image";
import React from "react";

const WaitingSlider = () => {
  return (
    <Box
      className="waiting-background"
      sx={{
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Phần tử hình nền */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage: 'url("/waiting.png")', // Đường dẫn hình ảnh
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          filter: "blur(10px)", // Điều chỉnh độ mờ tại đây
          zIndex: -1, // Đưa hình nền ra phía sau
        }}
      />
      <Stack
        justifyContent="center"
        alignItems="center"
        spacing={2}
        sx={{ height: "100%", position: "relative", zIndex: 1 }} // Nội dung nằm trên hình nền
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: "2rem",
              textShadow: "2px 2px 4px rgba(255, 255, 255, 0.7)",
            }}
          >
            Welcome to{" "}
          </Typography>
          <Stack direction="row" alignItems="center">
            <Typography
              sx={{
                color: "#1976D3",
                fontWeight: 700,
                fontSize: "2rem",
                textShadow: "2px 2px 4px rgba(255, 255, 255, 0.7)",
              }}
            >
              N
            </Typography>
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: "2rem",
                textShadow: "2px 2px 4px rgba(255, 255, 255, 0.7)",
              }}
            >
              A
            </Typography>
          </Stack>
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: "2rem",
              textShadow: "2px 2px 4px rgba(255, 255, 255, 0.7)",
            }}
          >
            Social
          </Typography>
        </Stack>
        <Typography
          variant="h7"
          sx={{fontSize:"1.3rem",padding:"0 1rem", textAlign:"center", textShadow: "2px 2px 4px rgba(255, 255, 255, 0.7)" }}
        >
          Join the conversation and share wonderful moments with friends and
          relatives right at NaS
        </Typography>
      </Stack>
    </Box>
  );
};

export default WaitingSlider;
