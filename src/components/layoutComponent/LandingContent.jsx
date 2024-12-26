"use client";
import { Box, Button, Stack, Typography } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

const LandingContent = () => {
  const router = useRouter();
  const handleJoinNaS = () => {
    router.push("/user");
  };
  return (
    <Box
      sx={{
        width: "100%",
        height: "100vh",

        position: "relative",
      }}
    >
      <Stack
        justifyContent="center"
        spacing={2}
        alignItems="center"
        sx={{ width: "100%", height: "100vh", position: "relative", zIndex: 1 }}
      >
        <Box
          sx={{
            background: "rgba(255, 255, 255,0.9)",
            borderRadius: "1rem",
            padding: "0.5rem",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
            width: "8rem",
            height: "8rem",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image src="/app-logo.png" width={130} height={130} alt="app-logo" />
        </Box>
        <Typography
          sx={{
            textAlign: "center",
            color: "#ffffff",
            padding: { xs: "1rem", sm: "2rem", md: "5rem" },
            fontSize: "2.5rem",
            fontWeight: "500",
            lineHeight: "1.4",
            fontFamily: "'Roboto', sans-serif",
          }}
          variant="h5"
        >
          Welcome to NaS – your social media.
          <br/>
          Join the NaS community today!
        </Typography>
        <Stack>
          <Button
            sx={{
              backgroundColor: "transparent",
              border: "2px solid #fff",
              color: "#fff",
              fontSize: "1.3rem",
              fontWeight: "bold",
              padding: "0.8rem 2rem",
              borderRadius: "3rem",
              transition: "0.3s ease",
              boxShadow: "0 0 15px rgba(255, 255, 255, 0.2)",
              "&:hover": {
                backgroundColor: "#fff",
                color: "#000",
                transform: "scale(1.05)",
                boxShadow: "0 0 30px rgba(255, 255, 255, 0.6)",
              },
            }}
            onClick={handleJoinNaS}
          >
            Get Started
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default LandingContent;
