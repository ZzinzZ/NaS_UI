import { USER_AVATAR_ORIGINAL } from "@/config/profileConfig";
import {
  Box,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Stack,
  Typography,
} from "@mui/material";
import Link from "next/link";
import React from "react";
import FriendListOverViewLoading from "../generals/FriendListOverViewLoading";

const ProfileFriendOverview = ({ friendList }) => {
  return (
    <Box
      sx={{
        background: "#fff",
        padding: "1rem",
        marginBottom: "1rem",
        borderRadius: "0.5rem",
        boxShadow: "0 1px 2px rgba(0,0,0,0.2)",
      }}
    >
      {friendList ? (
        <>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Stack>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Friends
              </Typography>
              <Typography variant="subtitle1">
                {friendList?.length} friends in total
              </Typography>
            </Stack>
            <Link href="/" style={{ textDecoration: "none", color: "#2877c9" }}>
              See all
            </Link>
          </Stack>
          <Box sx={{ marginTop: "1rem" }}>
            <ImageList cols={3} gap={8}>
              {friendList?.slice(0, 9).map((friend) => (
                <ImageListItem
                  key={friend._id}
                  sx={{
                    borderRadius: "0.5rem",
                    overflow: "hidden",
                  }}
                >
                  <Box
                    component="img"
                    srcSet={`${
                      friend?.avatar
                        ? friend.avatar?.content?.media[0].media_url
                        : USER_AVATAR_ORIGINAL
                    }?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                    src={`${
                      friend?.avatar
                        ? friend.avatar?.content?.media[0].media_url
                        : USER_AVATAR_ORIGINAL
                    }?w=164&h=164&fit=crop&auto=format`}
                    alt={friend.name}
                    loading="lazy"
                    sx={{
                      display: "block",
                      width: "100%",
                      height: "auto",
                      borderRadius: "0.5rem",
                    }}
                  />
                  <ImageListItemBar
                    title={
                      <Typography
                        variant="body2"
                        sx={{
                          whiteSpace: "normal",
                          wordWrap: "break-word",
                          textAlign: "center",
                        }}
                      >
                        {friend.userName}
                      </Typography>
                    }
                    position="below"
                    sx={{
                      width: "100%",
                      mt: 1, 
                    }}
                  />
                </ImageListItem>
              ))}
            </ImageList>
          </Box>
        </>
      ) : (
        <FriendListOverViewLoading />
      )}
    </Box>
  );
};

export default ProfileFriendOverview;
