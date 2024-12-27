"use client";
import { Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import PostItem from "../postComponent/PostItem";
import InboxIcon from '@mui/icons-material/Inbox';

const PostList = ({posts}) => {
  const [listPost , setListPost] = useState(posts);

  const handleDeletePost = (postId) => {
    const newListPost = listPost.filter((post) => post._id!== postId);
    setListPost(newListPost);
  }

  useEffect(() => {
    if(posts?.length > 0) {
      setListPost(posts);
    }
  },[posts])

  return (
    <Stack>
      {listPost?.length > 0 ? (
        listPost?.map((post) => <PostItem key={post?._id} postItem={post} onDelete={handleDeletePost} />)
      ) : (
        <Stack alignItems="center" justifyContent="center">
          <InboxIcon sx={{ fontSize: "3rem", color: "#ddd" }} />
          <Typography variant="body1" sx={{ fontStyle: "italic" }}>No post</Typography>
        </Stack>
      )}
    </Stack>
  );
};

export default PostList;
