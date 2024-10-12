"use client";
import { Box, Dialog, CircularProgress } from "@mui/material";

import { useSelector } from "react-redux";

export const FetchLoading = () => {
  const isLoading = useSelector((state) => state.loading.isLoading);
  return (
    <Dialog open={isLoading} disableScrollLock={true}>
      <div className="loading">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </Dialog>
  );
};
