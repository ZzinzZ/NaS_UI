"use client";
import React, { useState, useEffect } from "react";
import { Avatar, Box, Skeleton, Stack, Typography } from "@mui/material";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { reactComment, reactReplyComment } from "@/redux/thunks/postThunk";
import { formatDistanceToNow } from "date-fns";
import ReactSelector from "../generals/ReactSelector";
import CommentBar from "./CommentBar";
import { baseUrl, getRequest } from "@/utils/services/requestService";

const CommentItem = ({ post, comment, isReply = false }) => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [selectReact, setSelectReact] = useState(false);
  const [typeEmotion, setTypeEmotion] = useState("");
  const [emotionTextColor, setEmotionTextColor] = useState("#212121");
  const [imageSrc, setImageSrc] = useState(null);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [userComment, setUserComment] = useState(null);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const date = new Date(comment?.time);
  const formattedTime = formatDistanceToNow(date, { addSuffix: true });

  const handleOpenSelectReact = () => setSelectReact(true);
  const handleCloseSelectReact = () => setSelectReact(false);
  const toggleReplyInput = () => setShowReplyInput(!showReplyInput);

  const getUserProfile = async () => {
    setIsLoadingData(true);
    try {
      const response = await getRequest(
        `${baseUrl}/profiles/find_by_userId/${comment.userId}`
      );
      setUserComment(response.data);
    } catch (error) {
      console.log("Error getting user profile", error);
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    if (comment && user) {
      const userReaction = comment?.react.find(
        (emotion) => emotion.userId === user?._id
      );
      if (userReaction) {
        setTypeEmotion(userReaction.emotion);
      } else {
        setTypeEmotion("");
      }
    }

    getUserProfile();
  }, [comment, user]);
  console.log(userComment);

  useEffect(() => {
    switch (typeEmotion) {
      case "like":
      case "haha":
      case "wow":
      case "sad":
        setEmotionTextColor("#FFA726");
        break;
      case "favorite":
        setEmotionTextColor("#fb5056");
        break;
      case "angry":
        setEmotionTextColor("#e07823");
        break;
      case "wtf":
        setEmotionTextColor("#474645");
        break;
      default:
        setEmotionTextColor("#6f7277");
        break;
    }
  }, [typeEmotion]);

  const handleReactComment = async (key) => {
    let result;
    if (isReply) {
      result = await dispatch(
        reactReplyComment({
          postId: post?._id,
          userId: user?._id,
          commentId: comment?.replyToCommentId,
          emotion: key,
          replyCommentId: comment?._id,
        })
      );
    } else {
      result = await dispatch(
        reactComment({
          postId: post?._id,
          userId: user?._id,
          commentId: comment?._id,
          emotion: key,
        })
      );
    }

    setTypeEmotion(result.payload.emotion);
    setSelectReact(false);
  };

  useEffect(() => {
    if (comment?.image || comment?.gif) {
      const file = comment?.image || comment?.gif;
      if (file instanceof File) {
        const objectURL = URL.createObjectURL(file);
        setImageSrc(objectURL);
        return () => URL.revokeObjectURL(objectURL);
      } else {
        setImageSrc(file);
      }
    }
  }, [comment]);

  return isLoadingData ? (
    <Stack direction="row" spacing={1} sx={{ margin: "1rem 0" }}>
      <Skeleton variant="circular" width={40} height={40}/>
      <Skeleton variant="rounded" sx={{borderRadius:"1rem"}} width={230} height={60} />
    </Stack>
  ) : (
    <Stack direction="row" spacing={1} sx={{ margin: "1rem 0" }}>
      <Avatar src={userComment?.avatar?.content?.media[0].media_url} />
      <Stack className="comment-content" spacing={0.5}>
        {comment?.content && (
          <Box
            sx={{
              background: "#f1f2f6",
              borderRadius: "0.8rem",
              padding: "0.4rem 0.6rem",
              width: "100%",
            }}
          >
            <Stack>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {userComment?.userName}
              </Typography>
              <Typography variant="body2">{comment?.content}</Typography>
            </Stack>
          </Box>
        )}
        {imageSrc && (
          <Box>
            <Image
              src={imageSrc}
              width={300}
              height={300}
              alt="comment"
              style={{
                objectFit: "contain",
                borderRadius: "1rem",
                width: "100%",
                height: "100%",
              }}
            />
          </Box>
        )}
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography sx={{ color: "#6f7277", fontSize: "0.8rem" }}>
            {formattedTime}
          </Typography>
          <Box
            sx={{ position: "relative" }}
            onMouseEnter={handleOpenSelectReact}
            onMouseLeave={handleCloseSelectReact}
          >
            {selectReact && <ReactSelector handleReact={handleReactComment} />}
            <Typography
              sx={{
                color: emotionTextColor !== "" ? emotionTextColor : "#6f7277",
                fontSize: "0.8rem",
                fontWeight: 600,
              }}
            >
              {typeEmotion || "Like"}
            </Typography>
          </Box>

          <Typography
            onClick={toggleReplyInput}
            sx={{
              color: "#6f7277",
              fontSize: "0.8rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Reply
          </Typography>
        </Stack>

        {/* Reply Input Section */}
        {showReplyInput && (
          <Box sx={{ width: "100%" }}>
            <CommentBar post={post} comment={comment} />
          </Box>
        )}

        {/* Nested Replies */}
        {comment?.replies && comment?.replies.length > 0 && (
          <Box sx={{ marginLeft: "1rem", marginTop: "0.5rem" }}>
            {comment?.replies.map((reply, index) => (
              <CommentItem
                key={index}
                post={post}
                comment={reply}
                isReply={true}
              />
            ))}
          </Box>
        )}
      </Stack>
    </Stack>
  );
};

export default CommentItem;
