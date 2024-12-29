
"use client";
import { removeFriendRequest } from "@/redux/thunks/profileThunk";

import { Box, Button, Stack, Typography } from "@mui/material";
import Image from "next/image";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

const RequestSentItem = ({ profile, onRemove }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleRemoveRequest = async () => {
    try {
      dispatch(removeFriendRequest({receiverId:profile?.userId, senderId: user?._id }));
      onRemove();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Box
      sx={{
        background: "#fff",
        boxShadow: "0 1px 2px rgba(0,0,0,0.2)",
        width: "13rem",
        padding: "0.3rem",
        borderRadius: "0.5rem",
        margin: "0 0.75rem",
      }}
    >
      <Stack alignItems="center" justifyContent="center" spacing={1}>
        <Image
          src={
            profile.avatar?.content
              ? profile.avatar?.content?.media[0].media_url
              : "/avatar.jpg"
          }
          width={150}
          height={150}
          sx={{ borderRadius: "0.5rem" }}
          alt="profile avatar"
        />
        <Typography>{profile.userName}</Typography>
        <Stack sx={{ width: "90%" }} spacing={1}>
          <Button
            variant="contained"
            className="grey-profile-button"
            fullWidth
            onClick={handleRemoveRequest}
          >
            Remove
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default RequestSentItem;
