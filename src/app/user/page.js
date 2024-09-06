"use client";

import HomeContent from "@/components/homeComponent/HomeContent";
import ConversationShortcuts from "@/components/layoutComponent/ConversationShortcuts";
import HomeFeatureNav from "@/components/layoutComponent/HomeFeatureNav";
import { Container, Stack } from "@mui/material";
import React from "react";

const UserHome = () => {
  return (
    <>
      <Stack direction="row" justifyContent="space-between">
        <HomeFeatureNav />
          <Container maxWidth="sm" >
          <HomeContent /> 
          </Container>
        <ConversationShortcuts />
      </Stack>
    </>
  );
};

export default UserHome;
