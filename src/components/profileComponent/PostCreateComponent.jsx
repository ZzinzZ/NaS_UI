import React, { useState } from 'react';
import { USER_AVATAR_ORIGINAL } from "@/config/profileConfig";
import { Event, PhotoLibrary } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Stack,
  Typography,
} from "@mui/material";
import { useSelector } from "react-redux";
import CreatePostBoard from '../postComponent/CreatePostBoard';

const PostCreateComponent = ({onNew}) => {
  const { profileData } = useSelector((state) => state.profile);
  const [openDialog, setOpenDialog] = useState(false);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <>
      <Box
        sx={{
          background: "#fff",
          padding: "1rem",
          marginBottom: "1rem",
          borderRadius: "0.5rem",
          width: "100%",
          boxShadow: "0 1px 2px rgba(0,0,0,0.2)",
        }}
      >
        <Stack spacing={3}>
          <Stack direction="row" spacing={2} sx={{ width: "100%" }}>
            <Avatar src={profileData.avatar ? profileData.avatar?.content.media[0].media_url : USER_AVATAR_ORIGINAL} alt={profileData?.userName} />
            <Button
              onClick={handleOpenDialog} 
              sx={{
                width: "100%",
                background: "#f1f2f6",
                borderRadius: "2rem",
                color: "#656565",
                display: "flex",
                alignItems: "center",
                textAlign: "start",
              }}
            >
              <Typography
                sx={{
                  width: "100%",
                  textTransform: "capitalize",
                  paddingLeft: "0.9rem",
                }}
              >
                What are you thinking?
              </Typography>
            </Button>
          </Stack>
          <hr style={{ border: "0.5px solid #ccc" }} />
          <Stack direction="row" justifyContent="space-between">
            <Button className="create-post-box-button" fullWidth>
              <Stack direction="row" spacing={1} alignItems="end">
                <PhotoLibrary sx={{ color: "#41bf5e", fontSize: 30 }} />
                <Typography sx={{ fontWeight: "600", fontSize: "0.9rem" }}>Photo/video</Typography>
              </Stack>
            </Button>
            <Button className="create-post-box-button" fullWidth>
              <Stack direction="row" spacing={1} alignItems="end">
                <Event sx={{ color: "#03a4f2", fontSize: 30 }} />
                <Typography sx={{ fontWeight: "600", fontSize: "0.9rem" }}>Event</Typography>
              </Stack>
            </Button>
          </Stack>
        </Stack>
      </Box>
      <CreatePostBoard open={openDialog} handleClose={handleCloseDialog} onNew={onNew} profile={profileData}/>
    </>
  );
};

export default PostCreateComponent;
