import { acceptFriendRequest, rejectFriendRequest } from "@/redux/thunks/profileThunk";
import { Box, Button, Stack, Typography } from "@mui/material";
import Image from "next/image";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

const FriendRequestItem = ({ profile, onRemove }) => {
    const dispatch = useDispatch();
    const {user} = useSelector(state => state.auth);

    const handleAcceptRequest = async () => {
        try {
          await dispatch(
            acceptFriendRequest({ receiverId: user._id, senderId: profile.userId })
          );
          onRemove();
        } catch (error) {
            console.log(error);
        }
      };
    
      const handleRejectRequest = async () => {
        try {
          await dispatch(
            rejectFriendRequest({ receiverId: user._id, senderId: profile.userId })
          );
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
          alt="profile avatar"
        />
        <Typography>{profile.userName}</Typography>
        <Stack sx={{width:"90%"}} spacing={1}>
          <Button variant="contained" fullWidth onClick={handleAcceptRequest}>
            Accept
          </Button>
          <Button variant="contained" fullWidth className="grey-profile-button" onClick={handleRejectRequest}>
            Decline
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default FriendRequestItem;
