"use client";
import { Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import PostCreateComponent from "../profileComponent/PostCreateComponent";
import Shortcuts from "./Shortcuts";
import PostList from "./PostList";
import { getListPost } from "@/utils/services/postService/PostFeature";
import { useSelector } from "react-redux";
import Notifications from "./Notifications";

const PostPageContent = () => {
  const { user } = useSelector((state) => state.auth);
  const [posts, setPosts] = useState([]);

  const handleGetPosts = async () => {
    const result = await getListPost({ userId: user?._id });
    setPosts(result);
  };

  useEffect(() => {
    handleGetPosts();
  }, []);

  const onNewPost = () => {
    handleGetPosts();
  };

  return (
    <Stack direction="row" spacing={2} sx={{ padding: "1rem 1rem 0 1rem" }}>
      <Stack sx={{ width: { md: "25%", sm: "0%", xs: "0%" } }}>
        <Shortcuts />
      </Stack>
      <Stack
        sx={{
          width: { md: "50%", sm: "60%", xs: "100%" },
          height: "100vh",
          overflowY: "scroll",
          "&::-webkit-scrollbar": {
            display: "none",
          },
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          borderRadius:"0.5rem"
        }}
      >
        <PostCreateComponent onNew={onNewPost} />
        <PostList posts={posts} />
      </Stack>
      <Stack sx={{ width: { md: "25%", sm: "40%", xs: "0%" } }}>
        <Notifications />
      </Stack>
    </Stack>
  );
};

export default PostPageContent;
