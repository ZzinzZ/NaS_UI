import { Container, Stack } from "@mui/material";
import React from "react";
import PostCreateComponent from "../profileComponent/PostCreateComponent";
import PostItem from "../postComponent/PostItem";



const HomeContent = () => {

  return (
    <Stack sx={{ width: "45vw", marginTop: "0.3rem" }}>

      <Container>
        <Stack>
          Home
        </Stack>
      </Container>
    </Stack>
  );
};

export default HomeContent;
