"use client"

import { Box, ImageList, ImageListItem, Typography } from "@mui/material";
import Image from "next/image";

const RenderImages = ({ post }) => {
  const mediaCount = post?.content?.media?.length;

  if (mediaCount === 1) {
    return (
      <ImageList cols={1}>
        <ImageListItem>
          <Image
            src={post.content.media[0].media_url}
            alt="post-image"
            layout="responsive"
            width={100}
            height={100}
          />
        </ImageListItem>
      </ImageList>
    );
  } else if (mediaCount === 2) {
    return (
      <ImageList cols={2}>
        {post.content.media.map((media, index) => (
          <ImageListItem key={index}>
            <Image
              src={media.media_url}
              alt={`post-image-${index}`}
              layout="responsive"
              width={260}
              height={200}
            />
          </ImageListItem>
        ))}
      </ImageList>
    );
  } else if (mediaCount === 3) {
    return (
      <ImageList cols={2}>
        <ImageListItem cols={2}>
          <Image
            src={post.content.media[0].media_url}
            alt="post-image-0"
            layout="responsive"
            width={100}
            height={100}
            style={{
              width: "auto",
              height: 150,
            }}
          />
        </ImageListItem>
        <ImageListItem>
          <Image
            src={post.content.media[1].media_url}
            alt="post-image-1"
            layout="responsive"
            width={100}
            height={100}
          />
        </ImageListItem>
        <ImageListItem>
          <Image
            src={post.content.media[2].media_url}
            alt="post-image-2"
            layout="responsive"
            width={100}
            height={100}
          />
        </ImageListItem>
      </ImageList>
    );
  } else if (mediaCount >= 4) {
    return (
      <ImageList cols={2}>
        {post.content.media.slice(0, 4).map((media, index) => (
          <ImageListItem key={index}>
            <Image
              src={media.media_url}
              alt={`post-image-${index}`}
              layout="responsive"
              width={100}
              height={100}
            />
          </ImageListItem>
        ))}
        {mediaCount > 4 && (
          <ImageListItem cols={2}>
            <Box sx={{ position: "relative" }}>
              <Image
                src={post.content.media[4].media_url}
                alt="post-image-4"
                layout="responsive"
                width={100}
                height={100}
              />
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography variant="h4" color="white">
                  +{mediaCount - 4}
                </Typography>
              </Box>
            </Box>
          </ImageListItem>
        )}
      </ImageList>
    );
  }
};

export default RenderImages;
