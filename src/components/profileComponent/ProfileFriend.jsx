import { Box, Grid, Typography } from "@mui/material";
import React from "react";
import UserItem from "../generals/UserItem";

const ProfileFriend = ({ listFriend }) => {
  return (
    <Box
      sx={{
        background: "#fff",
        padding: "1rem",
        marginBottom: "1rem",
        borderRadius: "0.5rem",
        width: "100%",
        boxShadow: "0 1px 2px rgba(0,0,0,0.2)",
      }}
    >
      <Typography variant="h6" gutterBottom>
        Friends
      </Typography>

      <Grid container spacing={2}>
        {listFriend?.length > 0 ? listFriend?.map((list) => (
          <Grid item xs={6} key={list._id}>
            <UserItem profile={list} />
          </Grid>
        )): <Typography>User has no friend</Typography>}
      </Grid>
    </Box>
  );
};

export default ProfileFriend;
