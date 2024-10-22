import { Container, Stack } from "@mui/material";
import React from "react";
import PostCreateComponent from "../profileComponent/PostCreateComponent";
import PostItem from "../postComponent/PostItem";
import ChatBar from "../chatComponent/ChatBar";
import Conversation from "../chatComponent/Conversation";

const HomeContent = () => {
  return (
    <Stack direction="row">
      <ChatBar />
      <Conversation />
    </Stack>
  );
};

export default HomeContent;
