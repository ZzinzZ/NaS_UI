"use client"
import { Container, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ChatBar from "../chatComponent/ChatBar";
import Conversation from "../chatComponent/Conversation";
import WaitingSlider from "./WaitingSlider";

const HomeContent = () => {
  const searchParams = useSearchParams();
  const chatId = searchParams.get("chat-id");

  return (
    <Stack direction="row">
      <ChatBar />
      {
        chatId ? <Conversation /> : <WaitingSlider/>
      }
    </Stack>
  );
};

export default HomeContent;
