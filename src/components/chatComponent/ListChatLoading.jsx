"use client";
import { IconButton, Skeleton, Stack } from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import React from "react";

const arr = [1, 2, 3, 4, 5];
const ListChatLoading = () => {
  return (
    <Stack spacing={1}>
      {arr.map((item, index) => (
        <Stack
          spacing={1}
          sx={{ width: "18rem" }}
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          key={index}
        >
          <Stack spacing={1} direction="row" alignItems="center">
            <Skeleton variant="circular" width={50} height={50} />
            <Stack>
              <Skeleton variant="rounded" width={100} height={18} />
              <Skeleton variant="text" width={150} height={15} />
            </Stack>
          </Stack>
          <IconButton>
            <MoreHorizIcon />
          </IconButton>
        </Stack>
      ))}
    </Stack>
  );
};

export default ListChatLoading;
