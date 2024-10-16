import { Skeleton, Stack } from "@mui/material";
import React from "react";

const SearchLoading = () => {
  return (
    <Stack spacing={1}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          background: "#fff",
          borderRadius: "1rem",
          padding: "1rem 1rem",
          boxShadow: "0 1px 2px rgba(0,0,0,0.2)",
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <Skeleton variant="circular" width={40} height={40} />
          <Stack spacing={1}>
            <Skeleton variant="rounded" width={210} height={15} />
            <Skeleton variant="rounded" width={160} height={10} />
          </Stack>
        </Stack>
        <Skeleton variant="rounded" width={80} height={30} />
      </Stack>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          background: "#fff",
          borderRadius: "1rem",
          padding: "1rem 1rem",
          boxShadow: "0 1px 2px rgba(0,0,0,0.2)",
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <Skeleton variant="circular" width={40} height={40} />
          <Stack spacing={1}>
            <Skeleton variant="rounded" width={210} height={15} />
            <Skeleton variant="rounded" width={160} height={10} />
          </Stack>
        </Stack>
        <Skeleton variant="rounded" width={80} height={30} />
      </Stack>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          background: "#fff",
          borderRadius: "1rem",
          padding: "1rem 1rem",
          boxShadow: "0 1px 2px rgba(0,0,0,0.2)",
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <Skeleton variant="circular" width={40} height={40} />
          <Stack spacing={1}>
            <Skeleton variant="rounded" width={210} height={15} />
            <Skeleton variant="rounded" width={160} height={10} />
          </Stack>
        </Stack>
        <Skeleton variant="rounded" width={80} height={30} />
      </Stack>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          background: "#fff",
          borderRadius: "1rem",
          padding: "1rem",
          boxShadow: "0 1px 2px rgba(0,0,0,0.2)",
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <Skeleton variant="circular" width={40} height={40} />
          <Stack spacing={1}>
            <Skeleton variant="rounded" width={210} height={15} />
            <Skeleton variant="rounded" width={160} height={10} />
          </Stack>
        </Stack>
        <Skeleton variant="rounded" width={80} height={30} />
      </Stack>
    </Stack>
  );
};

export default SearchLoading;
