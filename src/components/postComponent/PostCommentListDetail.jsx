"use client";
import { Box, Dialog, IconButton, Stack, Typography } from "@mui/material";
import ShortTextIcon from "@mui/icons-material/ShortText";
import React, { useEffect, useState } from "react";
import CommentBar from "./CommentBar";
import CommentItem from "./CommentItem";
import { baseUrl, getRequest } from "@/utils/services/requestService";
import { useInView } from "react-intersection-observer";

const PostCommentListDetail = ({ open, handleClose, post, getPost }) => {
  const [userPost, setUserPost] = useState(null);

  const getUserProfile = async () => {
    try {
      const response = await getRequest(
        `${baseUrl}/profiles/find_by_userId/${post?.userId}`
      );
      setUserPost(response.data);
    } catch (error) {
      console.log("Error getting user profile", error);
    }
  };

  useEffect(() => {
    if(post && open) {
      getUserProfile();
    }
  }, [post]);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      disableScrollLock={true}
      PaperProps={{
        sx: {
          width: "60vw",
          maxWidth: "none",
          height: "80vh",
        },
      }}
    >
      <Stack sx={{ background: "#fff", height: "100%" }}>
        {/* Fixed Header */}
        <Box
          sx={{
            position: "sticky",
            top: 0,
            background: "#fff",
            zIndex: 1001,
            padding: "0.3rem",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ width: "100%" }}
          >
            <ShortTextIcon />
            <Typography sx={{ fontWeight: 600 }}>
              Article by {userPost?.userName}
            </Typography>
            <IconButton onClick={handleClose}>x</IconButton>
          </Stack>
        </Box>

        {/* Scrollable Comment List */}
        <Box
          sx={{
            flexGrow: 1,
            overflowY: "auto",
            padding: "1rem",
            backgroundColor: "#fff",
            paddingTop: "1rem",
          }}
        >
          {post?.comment?.length > 0 &&
            post?.comment.map((comment) => (
              <LazyLoadComment
                key={comment?._id}
                comment={comment}
                post={post}
              />
            ))}
        </Box>

        {/* Fixed Comment Bar */}
        <Box
          sx={{
            position: "sticky",
            bottom: 0,
            backgroundColor: "#fff",
            zIndex: 1000,
            boxShadow: "0 -2px 4px rgba(0, 0, 0, 0.1)",
            alignItems: "center",
            width: "100%",
            padding: "0.5rem",
          }}
        >
          <CommentBar post={post} getPost={getPost}/>
        </Box>
      </Stack>
    </Dialog>
  );
};

const LazyLoadComment = ({ comment, post }) => {
  const { ref, inView } = useInView({
    triggerOnce: true, 
    threshold: 0.1, 
  });

  return (
    <Box ref={ref}>
      {inView ? (
        <CommentItem comment={comment} post={post} />
      ) : (
        null
      )}
    </Box>
  );
};

export default PostCommentListDetail;
