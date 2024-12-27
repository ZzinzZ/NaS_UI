"use client"
import { Box, Grid, Typography } from "@mui/material";
import React from "react";
import UserItem from "../generals/UserItem";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined"; // Import icon

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
        {listFriend?.length > 0 ? (
          listFriend?.map((list) => (
            <Grid item xs={6} key={list._id}>
              <UserItem profile={list} />
            </Grid>
          ))
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              padding: "2rem",
              color: "#999",
            }}
          >
            <PeopleAltOutlinedIcon sx={{ fontSize: 64, color: "#ddd", mb: 1 }} />
            <Typography variant="body1" sx={{ fontStyle: "italic" }}>
              User has no friend
            </Typography>
          </Box>
        )}
      </Grid>
    </Box>
  );
};

export default ProfileFriend;
