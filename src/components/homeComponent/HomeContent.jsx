"use client";
import { Box, Stack, useMediaQuery, useTheme } from "@mui/material";
import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import ChatBar from "../chatComponent/ChatBar";
import Conversation from "../chatComponent/Conversation";
import WaitingSlider from "./WaitingSlider";

const HomeContent = () => {
  const [isDeleteMessages, setIsDeleteMessages] = useState(false);

  const searchParams = useSearchParams();
  const chatId = searchParams.get("chat-id");

  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md")); 
  const isPhone = useMediaQuery(theme.breakpoints.down("sm")); 

  return (
    <Stack direction="row" sx={{ height: "100vh" }}>
      {isPhone ? (
        chatId ? (
          <Box sx={{ width: "100%" }}>
            <Conversation isDeleteMessages={isDeleteMessages} />
          </Box>
        ) : (
          <ChatBar setIsDeleteMessages={setIsDeleteMessages} />
        )
      ) : isTablet ? (
        chatId ? (
          <Box sx={{ width: "100%" }}>
            <Conversation isDeleteMessages={isDeleteMessages} />
          </Box>
        ) : (
          <ChatBar setIsDeleteMessages={setIsDeleteMessages} />
        )
      ) : (
        <>
          <ChatBar setIsDeleteMessages={setIsDeleteMessages} />
          {chatId ? (
            <Box sx={{ width: "100%" }}>
              <Conversation isDeleteMessages={isDeleteMessages} />
            </Box>
          ) : (
            <WaitingSlider />
          )}
        </>
      )}
    </Stack>
  );
};

export default HomeContent;
