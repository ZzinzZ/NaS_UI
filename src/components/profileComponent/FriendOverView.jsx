import { Avatar, Box, Button, Stack, Typography } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useRouter } from "next/navigation";
import React from "react";
import { USER_AVATAR_ORIGINAL } from "@/config/profileConfig";

const FriendOverView = ({ profile }) => {
  const router = useRouter();
  const handleViewProfile = () => {
    router.push(`/user/profile?id=${profile?.userId}`);
  };
  
  return (
    <Box sx={{ background: "#fff", padding: "1rem" }}>
      <Stack
        spacing={{ xs: 2, sm: 1 }}
        sx={{ background: "#fff" }}
        direction="row"
        useFlexGap
        flexWrap="wrap"
        alignItems="center"
      >
        <Box sx={{ background: "#fff" }}>
          <Avatar
           src={profile?.avatar ? profile.avatar?.content?.media[0].media_url : USER_AVATAR_ORIGINAL}
            alt={profile?.userName}
            sx={{ width: 120, height: 120 }}
          />
        </Box>
        <Stack spacing={1}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {profile?.userName}
          </Typography>
          <Stack sx={{ background: "#fff" }} spacing={2}>
            <Button
              className="grey-profile-button"
              startIcon={<AccountCircleIcon />}
              variant="outlined"
              onClick={handleViewProfile}
            >
              View Profile
            </Button>
            <Button variant="contained" startIcon={<ChatIcon />}>
              Message
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
};

export default FriendOverView;
