"use client"
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
    <Box sx={{ zIndex: 100 }}>
      <Stack
        justifyContent="center"
        spacing={5}
        alignItems="center"
        sx={{ width: "100%", height: "100vh" }}
      >
        <Box
          sx={{
            background: "rgba(255, 255, 255,0.8)",
            borderRadius: "1rem",
            padding: "0 0 0 0 10rem",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            width: "8rem",
            height: "8rem",
          }}
        >
          <Image
            src="/app-logo.png"
            width={130}
            height={130}
            alt="app-logo"
            style={{ padding: "0 0 0 0.2rem" }}
          />
        </Box>
        <Typography
          sx={{
            textAlign: "center",
            color: "#fff",
            padding: "0 5rem",
            fontSize: "2rem",
          }}
          variant="h5"
        >
          Welcome to NaS – your social media. Chat, connect, and share moments
          with ease. Join the NaS community today!
        </Typography>
        <Stack>
          <Button
            sx={{
              border: "1.5px solid white",
              color: "#fff",
              borderRadius: "3rem",
              width: "10rem",
              height: "4rem",
              fontSize: "1.3rem",
              transition:"0.25s ease-in-out",
              "&:hover": {
                width: "11rem",
              }
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
