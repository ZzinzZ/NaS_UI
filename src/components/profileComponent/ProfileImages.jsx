"use client";
import { getListPhotos } from "@/utils/services/postService/getListPhoto";
import {
  Box,
  Container,
  ImageList,
  ImageListItem,
  Stack,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import FriendListOverViewLoading from "../generals/FriendListOverViewLoading";

const ProfileImages = () => {
  const searchParams = useSearchParams();
  const userId = searchParams.get("id");
  const [listImage, setListImage] = useState();

  useEffect(() => {
    const getListImage = async () => {
      const response = await getListPhotos({ userId });
      console.log(response);
      
      setListImage(response);
    };
    getListImage();
  }, [userId]);

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
      {listImage ? (
        <Box>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Image
            </Typography>
            <Link href="/" style={{ textDecoration: "none", color: "#2877c9" }}>
              See all
            </Link>
          </Stack>
          <Box sx={{ marginTop: "1rem" }}>
            <ImageList cols={3} gap={8}>
              {listImage.slice(0, 9).map((item) => (
                <ImageListItem 
                  key={item.image} 
                  sx={{
                    width: "100%",
                    height: "0",
                    paddingBottom: "100%", 
                    position: "relative", 
                    overflow: "hidden", 
                    borderRadius: "0.5rem",
                  }}
                >
                  <img
                    srcSet={`${item.image}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                    src={`${item.image}?w=164&h=164&fit=crop&auto=format`}
                    alt={"image"}
                    loading="lazy"
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      transform: "translate(-50%, -50%)",
                    }}
                  />
                </ImageListItem>
              ))}
            </ImageList>
          </Box>
        </Box>
      ) : (
        <FriendListOverViewLoading />
      )}
    </Box>
  );
};

export default ProfileImages;
