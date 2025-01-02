"use client";
import { getListFriendRequests } from "@/utils/services/profileService/getListFriend";
import { Stack, Typography, Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import PersonOffIcon from "@mui/icons-material/PersonOff";
import FriendRequestItem from "./FriendRequestItem";

const FriendRequestList = () => {
  const { user = null } = useSelector((state) => state.auth ?? {});

  const [listRequest, setListRequest] = useState([]);

  const getListRequest = async () => {
    try {
      const requests = await getListFriendRequests({ userId: user._id });
      setListRequest(requests);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getListRequest();
  }, []);

  return (
    <Stack
      sx={{
        padding: "1.5rem",
        backgroundColor: "#f9f9f9",
        borderRadius: "0.8rem",
      }}
    >
      <Typography
        variant="h6"
        sx={{ marginBottom: "1rem", color: "#333", fontWeight: "bold" }}
      >
        Friend Requests
      </Typography>
      <Stack
        direction="row"
        justifyContent="center"
        sx={{ flexWrap: "wrap", rowGap: "1.2rem", columnGap: "1rem" }}
      >
        {listRequest?.length > 0 ? (
          listRequest?.map((request, index) => (
            <Box
              key={index}
              sx={{
                borderRadius: "0.5rem",
                overflow: "hidden",
                transition: "transform 0.2s",
                "&:hover": {
                  transform: "scale(1.02)",
                },
              }}
            >
              <FriendRequestItem profile={request} onRemove={getListRequest} />
            </Box>
          ))
        ) : (
          <Stack
            spacing={1}
            alignItems="center"
            justifyContent="center"
            sx={{ color: "#aaa" }}
          >
            <PersonOffIcon sx={{ fontSize: "3rem", color: "#ddd" }} />
            <Typography variant="body1" sx={{ fontStyle: "italic" }}>
              No friend requests
            </Typography>
          </Stack>
        )}
      </Stack>
    </Stack>
  );
};

export default FriendRequestList;
