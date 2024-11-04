"use client";
import { getListFriendRequests } from "@/utils/services/profileService/getListFriend";
import { Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import FriendRequestItem from "./FriendRequestItem";

const FriendRequestList = () => {
  const { user } = useSelector((state) => state.auth);
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
    <Stack>
      <Typography>Friend requests</Typography>
      <Stack
        direction="row"
        justifyContent="center"
        sx={{ flexWrap: "wrap", rowGap: "0.8rem" }}
      >
        {listRequest?.length > 0 ? (
          listRequest?.map((request, index) => (
            <FriendRequestItem key={index} profile={request} onRemove={getListRequest} />
          ))
        ) : (
          <Typography>No request</Typography>
        )}
      </Stack>
    </Stack>
  );
};

export default FriendRequestList;
