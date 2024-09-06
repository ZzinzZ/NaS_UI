import { Container, Stack } from "@mui/material";
import React from "react";
import PostCreateComponent from "../profileComponent/PostCreateComponent";
import StoryListView from "./ListStoryView";
import { useSelector } from "react-redux";
import PostItem from "../postComponent/PostItem";

const stories = [
  {
    mediaUrl: "https://i.pinimg.com/736x/49/23/8a/49238a0500ec19ed18e23c0338600a77.jpg",
    userName: "User 1",
    timeAgo: "5 minutes ago",
  },
  {
    mediaUrl: "https://i.pinimg.com/736x/49/23/8a/49238a0500ec19ed18e23c0338600a77.jpg",
    userName: "User 2",
    timeAgo: "10 minutes ago",
  },
  {
    mediaUrl: "https://i.pinimg.com/736x/49/23/8a/49238a0500ec19ed18e23c0338600a77.jpg",
    userName: "User 2",
    timeAgo: "10 minutes ago",
  },
  
  {
    mediaUrl: "https://i.pinimg.com/736x/49/23/8a/49238a0500ec19ed18e23c0338600a77.jpg",
    userName: "User 2",
    timeAgo: "10 minutes ago",
  },
];

const handleStoryClick = (story) => {
  console.log("Clicked on:", story);
  // Xử lý logic khi người dùng click vào một story
};

const HomeContent = () => {
    const {posts} = useSelector((state) => state.posts)
  return (
    <Stack sx={{ width: "45vw", marginTop: "0.3rem" }}>
      <StoryListView stories={stories} onStoryClick={handleStoryClick} />
      <Container>
        <Stack>
            <PostCreateComponent />
            {
                posts?.map((post, index) => (
                    <PostItem key={index} postItem={post} />
                ))
            }
        </Stack>
      </Container>
    </Stack>
  );
};

export default HomeContent;
