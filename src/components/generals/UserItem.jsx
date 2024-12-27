"use client"
import { NEXT_IMAGE_ORIGINAL_AVATAR } from "@/config/profileConfig";
import { Box, Stack, Typography, useMediaQuery } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTheme } from "@mui/material/styles"; // Nhập useTheme từ MUI
import React from "react";

const UserItem = ({ profile }) => {
  const router = useRouter();
  const theme = useTheme();

  const handleClickProfile = (id) => {
    router.push(`/user/profile?id=${id}`);
  };

  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const imageSize = isSmallScreen ? 60 : 120; 

  return (
    <Box
      onClick={() => handleClickProfile(profile.userId)} 
      sx={{
        background: "#fff",
        borderRadius: "5px",
        padding: "1rem",
        border: "0.1px solid rgb(222, 223, 228)",
        textAlign: "center",
        width: "100%",
        cursor: "pointer",
      }}
    >
      <Stack direction="row" alignItems="center">
        <Stack direction="row" alignItems="center" spacing={1}>
          <Image
            alt={profile.userName}
            src={
              profile.avatar?.content?.media[0].media_url || NEXT_IMAGE_ORIGINAL_AVATAR
            }
            width={imageSize} 
            height={imageSize}
            style={{ borderRadius: "50%", width:imageSize, height:imageSize }} 
          />
          <Typography
            variant="body1"
            sx={{ fontWeight: 500, fontSize: "1.3rem", marginBottom: "0.5rem" }}
          >
            {profile.userName}
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
};

export default UserItem;
