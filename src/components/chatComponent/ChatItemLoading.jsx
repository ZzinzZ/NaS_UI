import { Box, IconButton, Skeleton, Stack } from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import React from "react";

const ChatItemLoading = () => {
  return (
      <Stack
        spacing={1}
        sx={{ width: "18rem", padding:"0 1.3rem 0 0" }}
        direction="row"
        justifyContent="space-between"
        alignItems="center"
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
  );
};

export default ChatItemLoading;
