"use client"
import { Container, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ChatBar from "../chatComponent/ChatBar";
import Conversation from "../chatComponent/Conversation";
import WaitingSlider from "./WaitingSlider";

const HomeContent = () => {
  const [isDeleteMessages, setIsDeleteMessages] = useState(false);
  
  const searchParams = useSearchParams();
  const chatId = searchParams.get("chat-id");

  return (
    <Stack direction="row"  >
      <ChatBar setIsDeleteMessages={setIsDeleteMessages}/>
      {
        chatId ? <Conversation isDeleteMessages={isDeleteMessages}/> : <WaitingSlider/>
      }
    </Stack>
  );
};

export default HomeContent;
