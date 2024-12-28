"use client"
import { showImage } from "@/redux/slices/imageSlice";
import { getListPhotos } from "@/utils/services/postService/getListPhoto";
import { Box, Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import HideImageIcon from '@mui/icons-material/HideImage';

const ProfileLibrary = ({ userId }) => {
  const [listImage, setListImage] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    const getListImage = async () => {
      const response = await getListPhotos({ userId });
      setListImage(response); // Set ảnh trả về từ API
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
        width: "100%",
        boxShadow: "0 1px 2px rgba(0,0,0,0.2)",
      }}
    >
      <Typography variant="h6" gutterBottom>
        Library
      </Typography>

      {/* Grid để sắp xếp hình ảnh */}
      {listImage?.length > 0 ? (
        <Grid container spacing={2}>
          {listImage?.map((image, index) => (
            <Grid item xs={6} sm={4} md={3} key={index}>
              <Box
                component="img"
                src={image.image}
                alt={`image-${index}`}
                onClick={() => {
                  dispatch(showImage(image.image));
                }}
                sx={{
                  width: "100%", 
                  height: "200px", 
                  borderRadius: "8px",
                  objectFit: "cover",
                }}
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "2rem",
            }}
          >
            <HideImageIcon  sx={{ fontSize: "3rem", color: "#ddd" }} />
            <Typography variant="body1" sx={{ fontStyle: "italic" }}>
              Library empty
            </Typography>
          </Box>
      )}
    </Box>
  );
};

export default ProfileLibrary;
