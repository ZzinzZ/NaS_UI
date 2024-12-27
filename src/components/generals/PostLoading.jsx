"use client"
import { Box, Skeleton, Stack } from "@mui/material";
import React from "react";

const PostLoading = () => {
  return (
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
      <Stack spacing={2}>
        <Stack direction="row" spacing={2}>
          <Skeleton variant="circular" width={40} height={40} />
          <Stack>
            <Skeleton width={100} />
            <Skeleton width={90} height={10} />
          </Stack>
        </Stack>
        <Skeleton
          variant="rectangular"
          width="100%"
          sx={{ borderRadius: "1rem" }}
        >
          <div style={{ paddingTop: "30%" }} />
        </Skeleton>
        <Stack direction="row" justifyContent="space-between">
            <Skeleton width={100} />
            <Skeleton width={100} />
            <Skeleton width={100} />
        </Stack>
      </Stack>
    </Box>
  );
};

export default PostLoading;
