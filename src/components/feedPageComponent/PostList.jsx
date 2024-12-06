"use client";
import { getListPost } from "@/utils/services/postService/PostFeature";
import { Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import PostItem from "../postComponent/PostItem";

const PostList = ({posts}) => {
  const { user } = useSelector((state) => state.auth);

  return (
    <Stack>
      {posts?.length > 0 ? (
        posts.map((post) => <PostItem key={post?._id} postItem={post} />)
      ) : (
        <>No post</>
      )}
    </Stack>
  );
};

export default PostList;
