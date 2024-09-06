"use client";
import {
  Avatar,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListSubheader,
  Stack,
  Typography,
} from "@mui/material";
import GroupIcon from "@mui/icons-material/Group";
import GroupsIcon from "@mui/icons-material/Groups";
import SmartDisplayIcon from "@mui/icons-material/SmartDisplay";
import BatchPredictionIcon from "@mui/icons-material/BatchPrediction";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import React from "react";

const HomeFeatureNav = () => {
  return (
    <Box
      sx={{
        width: "20vw",
        position: "fixed",
        top: "3.35rem",
        left: "0",
        height: "calc(100vh - 3.2rem)",
        overflowY: "auto",
        paddingBottom: "1rem",
        "&::-webkit-scrollbar": {
          width: "0.4rem",
          display: "none", // Ẩn thanh cuộn khi không cuộn
        },
        "&:hover::-webkit-scrollbar": {
          display: "block", // Hiển thị thanh cuộn khi di chuột vào
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "rgba(0, 0, 0, 0.2)",
          borderRadius: "1rem",
        },
        "&::-webkit-scrollbar-thumb:hover": {
          backgroundColor: "rgba(0, 0, 0, 0.3)",
        },
        "&::-webkit-scrollbar-track": {
          background: "transparent",
        },
      }}
    >
      <List>
        <ListItem>
          <ListItemButton>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar width={27} height={27} />
              <Typography sx={{ fontWeight: 500 }}>Nhat Anh</Typography>
            </Stack>
          </ListItemButton>
        </ListItem>
        <ListItem>
          <ListItemButton>
            <Stack direction="row" spacing={2} alignItems="center">
              <GroupIcon fontSize="large" sx={{ color: "#1976d3" }} />
              <Typography sx={{ fontWeight: 500 }}>Friends</Typography>
            </Stack>
          </ListItemButton>
        </ListItem>
        <ListItem>
          <ListItemButton>
            <Stack direction="row" spacing={2} alignItems="center">
              <AccessTimeFilledIcon
                fontSize="large"
                sx={{ color: "#1976d3" }}
              />
              <Typography sx={{ fontWeight: 500 }}>Events</Typography>
            </Stack>
          </ListItemButton>
        </ListItem>
        <ListItem>
          <ListItemButton>
            <Stack direction="row" spacing={2} alignItems="center">
              <GroupsIcon fontSize="large" sx={{ color: "#1976d3" }} />
              <Typography sx={{ fontWeight: 500 }}>Groups</Typography>
            </Stack>
          </ListItemButton>
        </ListItem>
        <ListItem>
          <ListItemButton>
            <Stack direction="row" spacing={2} alignItems="center">
              <SmartDisplayIcon fontSize="large" sx={{ color: "#1976d3" }} />
              <Typography sx={{ fontWeight: 500 }}>Video</Typography>
            </Stack>
          </ListItemButton>
        </ListItem>
        <ListItem>
          <ListItemButton>
            <Stack direction="row" spacing={2} alignItems="center">
              <BatchPredictionIcon fontSize="large" sx={{ color: "#1976d3" }} />
              <Typography sx={{ fontWeight: 500 }}>Feed board</Typography>
            </Stack>
          </ListItemButton>
        </ListItem>
      </List>
      <hr />
      <Typography sx={{ padding: "1rem", color: "#5f6871", fontWeight: 500 }}>
        Your shortcuts
      </Typography>
      <List sx={{ background: "transparent" }}>
        <ListItem>
          <ListItemButton>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar width={30} height={30} />
              <Typography>Nhat Anh</Typography>
            </Stack>
          </ListItemButton>
        </ListItem>
        <ListItem>
          <ListItemButton>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar width={30} height={30} />
              <Typography>Nhat Anh</Typography>
            </Stack>
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );
};

export default HomeFeatureNav;
