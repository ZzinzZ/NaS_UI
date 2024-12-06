"use client"
import { Stack } from '@mui/material'
import React, { useEffect, useState } from 'react'
import PostCreateComponent from '../profileComponent/PostCreateComponent'
import Shortcuts from './Shortcuts'
import PostList from './PostList'
import { getListPost } from '@/utils/services/postService/PostFeature'
import { useSelector } from 'react-redux'

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
  }

  return (
    <Stack direction="row" spacing={2} sx={{padding:"1rem"}}>
        <Stack sx={{width:{sm:"70%", sm:"60%", xs:"100%"}}}>
            <PostCreateComponent onNew={onNewPost}/>
            <PostList posts={posts}/>
        </Stack>
        <Stack sx={{width:{sm:"30%", sm:"40%", xs:"0%"}}}>
            <Shortcuts/>
        </Stack>
    </Stack>
  )
}

export default PostPageContent