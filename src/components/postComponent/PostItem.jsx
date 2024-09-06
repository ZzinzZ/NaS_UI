"use client";
import React, { useEffect, useState } from "react";
import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ReplyIcon from "@mui/icons-material/Reply";
import { ReactionBarSelector } from "@charkour/react-reactions";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import { formatDistanceToNow, format } from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import { getPostDetails, reactPost } from "@/redux/thunks/postThunk";
import RenderImages from "./RenderImage";
import CommentBar from "./CommentBar";
import ReactSelector from "../generals/ReactSelector";
import PostCommentListDetail from "./PostCommentListDetail";
import PostLoading from "../generals/PostLoading";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return "Invalid date";
  }

  const now = new Date();

  if (now - date < 24 * 60 * 60 * 1000) {
    return formatDistanceToNow(date, { addSuffix: true });
  } else {
    return format(date, "dd MMMM yyyy 'at' HH:mm");
  }
};

const PostItem = ({ profile, postItem }) => {
  const [selectReact, setSelectReact] = useState(false);
  const [render, setRender] = useState(false);
  const [typeEmotion, setTypeEmotion] = useState("");
  const [emotionTextColor, setEmotionTextColor] = useState("");
  const [isReacted, setIsReacted] = useState(false);
  const [openPostComments, setOpenPostComments] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [postUser, setPostUser] = useState();
  const [post, setPost] = useState(null);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const getPost = async () => {
    setIsLoadingData(true);
    try {
      const post = await dispatch(getPostDetails(postItem?._id));
      console.log(post.payload);
      
      setPost(post.payload.post);
      setPostUser(post.payload.profile);
      setRender(true);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {   
    getPost();
  },[profile, dispatch])

  useEffect(() => {
    if(!postItem) {
      setIsLoadingData(true)
    }
    else{
      setIsLoadingData(false);
    }
    
  },[postItem])

  useEffect(() => {
    if (post && user) {
      const userReaction = post?.react?.find(
        (emotion) => emotion.userId === user._id
      );

      if (userReaction) {
        setIsReacted(true);
        setTypeEmotion(userReaction.emotion);
      } else {
        setIsReacted(false);
        setTypeEmotion("");
      }
    }
  }, [post, user, render]);

  useEffect(() => {
    switch (typeEmotion) {
      case "like":
        setEmotionTextColor("#FFA726");
        break;
      case "haha":
        setEmotionTextColor("#FFA726");
        break;
      case "favorite":
        setEmotionTextColor("#fb5056");
        break;
      case "wow":
        setEmotionTextColor("#FFA726");
        break;
      case "sad":
        setEmotionTextColor("#FFA726");
        break;
      case "angry":
        setEmotionTextColor("#e07823");
        break;
      case "wtf":
        setEmotionTextColor("#474645");
        break;
      default:
        setEmotionTextColor("#212121");
        break;
    }
  }, [typeEmotion]);

  const handleOpenSelectReact = () => {
    setSelectReact(true);
  };
  const handleCloseSelectReact = () => {
    setSelectReact(false);
  };

  const handleReactPost = async (key) => {
    setRender(!render);
    await dispatch(
      reactPost({ postId: post?._id, userId: user?._id, emotion: key })
    );
    getPost();
    setSelectReact(false);
  };

  const sortedReacts = post?.react?.reduce((acc, react) => {
    acc[react.emotion] = (acc[react.emotion] || 0) + 1;
    return acc;
  }, {});

  const sortedReactTypes = sortedReacts
    ? Object.entries(sortedReacts)
        .sort((a, b) => b[1] - a[1])
        .map(([type]) => type)
    : [];

  const handleOpenCommentList = () => {
    setOpenPostComments(true);
  };
  const handleCloseCommentList = () => {
    setOpenPostComments(false);
  };
  console.log("postItem", profile);
  

  return (
    post?.createdAt ? (
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
      <PostCommentListDetail
        open={openPostComments}
        handleClose={handleCloseCommentList}
        post={post}
        getPost={getPost}
      />
      <Stack spacing={1}>
        <Stack direction="row" justifyContent="space-between">
          <Stack direction="row" spacing={2}>
            <Avatar src={postUser?.avatar?.content.media[0].media_url} />
            <Stack>
              <Typography fontWeight="bold">{postUser?.userName}</Typography>
              <Typography color="textSecondary" variant="body2">
                {formatDate(post?.createdAt)}
              </Typography>
            </Stack>
          </Stack>
          <IconButton>
            <MoreHorizIcon />
          </IconButton>
        </Stack>
        {post?.content?.caption && (
          <Box>
            <Typography>{post?.content?.caption}</Typography>
          </Box>
        )}
        <RenderImages post={post} />
        {(post?.comment?.length > 0 ||
          post?.react?.length > 0 ||
          post?.share?.length > 0) && (
          <Stack spacing={1}>
            <hr style={{ border: "0.5px solid #ccc" }} />
            <Stack direction="row" justifyContent="space-between">
              {post?.react?.length > 0 && (
                <Stack direction="row" spacing={1}>
                  <AvatarGroup max={7}>
                    {sortedReactTypes.map((type, index) => (
                      <Avatar
                        key={index}
                        sx={{ width: 18, height: 18, background: "#fff" }}
                        src={`/${type}.png`}
                      />
                    ))}
                  </AvatarGroup>
                  <Typography
                    sx={{
                      fontSize: "1rem",
                      color: "#656567",
                    }}
                  >
                    {post?.react?.length}
                  </Typography>
                </Stack>
              )}
              <Stack direction="row" spacing={2} alignItems="start ">
                {post?.comment?.length > 0 && (
                  <Stack
                    direction="row"
                    spacing={1}
                    onClick={handleOpenCommentList}
                    sx={{
                      cursor: "pointer",
                      "&:hover": {
                        textDecoration: "underline",
                      },
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "1rem",
                        color: "#656567",
                      }}
                    >
                      {post?.comment?.length}
                    </Typography>
                    <ChatBubbleIcon sx={{ fontSize: 20, color: "#656567" }} />
                  </Stack>
                )}
                {post?.share?.length > 0 && (
                  <Stack direction="row" spacing={1}>
                    <Typography
                      sx={{
                        fontSize: "1rem",
                        color: "#656567",
                      }}
                    >
                      {post?.share?.length}
                    </Typography>
                    <ReplyIcon sx={{ fontSize: 20, color: "#656567" }} />
                  </Stack>
                )}
              </Stack>
            </Stack>
          </Stack>
        )}
        <hr style={{ border: "0.5px solid #ccc" }} />
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
        >
          <Box
            sx={{ width: "100%", position: "relative", padding: "0 7px " }}
            onMouseEnter={handleOpenSelectReact}
            onMouseLeave={handleCloseSelectReact}
          >
            {selectReact && <ReactSelector handleReact={handleReactPost} />}
            {isReacted ? (
              <Button fullWidth>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Avatar
                    src={`/${typeEmotion}.png`}
                    sx={{ width: 25, height: 25 }}
                  />
                  <Typography
                    sx={{
                      fontWeight: 600,
                      color: `${emotionTextColor}`,
                      textTransform: "capitalize",
                    }}
                  >
                    {typeEmotion}
                  </Typography>
                </Stack>
              </Button>
            ) : (
              <Button
                fullWidth
                startIcon={
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 30,
                      height: 30,
                    }}
                  >
                    <ThumbUpOffAltIcon
                      sx={{ color: "#656567", fontSize: 30 }}
                    />
                  </Box>
                }
                sx={{ color: "#656567" }}
              >
                Like
              </Button>
            )}
          </Box>
          <Button
            fullWidth
            startIcon={
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 30,
                  height: 30,
                }}
              >
                <ChatBubbleOutlineIcon
                  sx={{ color: "#656567", fontSize: 30 }}
                />
              </Box>
            }
            sx={{ color: "#656567" }}
          >
            Comment
          </Button>
          <Button
            fullWidth
            startIcon={
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 30,
                  height: 30,
                }}
              >
                <ReplyIcon sx={{ color: "#656567", fontSize: 30 }} />
              </Box>
            }
            sx={{ color: "#656567" }}
          >
            Share
          </Button>
        </Stack>
        <hr style={{ border: "0.5px solid #ccc" }} />
        <CommentBar post={post} userId={user?._id} getPost={getPost}/>
      </Stack>
    </Box>
    ) : (<PostLoading/>)
  );
};

export default PostItem;
