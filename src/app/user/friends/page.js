import FriendNavBar from "@/components/friendComponent/FriendNav";
import { Box, Container } from "@mui/material";
import React from "react";

const FriendPage = () => {
  return (
    <Box sx={{marginTop:{md: 0, xs: "3rem", sm:"3rem"}}}>
      <FriendNavBar />
    </Box>
  );
};

export default FriendPage;
