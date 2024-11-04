"use client";
import { getListFriendRequestSent } from "@/utils/services/profileService/getListFriend";
import { Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import RequestSentItem from "./RequestSentItem";

const RequestSentList = () => {
  const { user } = useSelector((state) => state.auth);
  const [listRequest, setListRequest] = useState([]);

  const getListRequestSent = async () => {
    try {
      const requests = await getListFriendRequestSent({ userId: user._id });
      setListRequest(requests);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getListRequestSent();
  }, []);

  return (
    <Stack>
      <Typography>Requests sent</Typography>
      <Stack
        direction="row"
        justifyContent="center"
        sx={{ flexWrap: "wrap", rowGap: "0.8rem" }}
      >
        {listRequest?.length > 0 ? (
          listRequest?.map((request, index) => (
            <RequestSentItem key={index} profile={request} onRemove={getListRequestSent} />
          ))
        ) : (
          <Typography>No request</Typography>
        )}
      </Stack>
    </Stack>
  );
};

export default RequestSentList;
