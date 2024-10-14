"use client";

import HomeContent from "@/components/homeComponent/HomeContent";
import { Container, Stack } from "@mui/material";
import React from "react";

const UserHome = () => {
  return (
    <>
      <Stack direction="row" justifyContent="space-between">
          <Container maxWidth="sm" >
          <HomeContent /> 
          </Container>

      </Stack>
    </>
  );
};

export default UserHome;
