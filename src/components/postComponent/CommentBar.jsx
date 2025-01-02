"use client";
import {
  Avatar,
  Box,
  Button,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import GifPicker from "gif-picker-react";
import EmojiPicker from "emoji-picker-react";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import GifBoxIcon from "@mui/icons-material/GifBox";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { commentPost, replyCommentPost } from "@/redux/thunks/postThunk";
import SendIcon from "@mui/icons-material/Send";
import useComponentPosition from "@/customHooks/useComponentPosition";
import VisuallyHiddenInput from "../generals/VisuallyHiddenInput";
import CommentItem from "./CommentItem";

const CommentBar = ({ post, comment, getPost }) => {
  const dispatch = useDispatch();
  const ref = useRef();
  const inputRef = useRef();
  const [isInputComment, setIsInputComment] = useState(false);
  const [pickerEmoji, setPickerEmoji] = useState(false);
  const [pickerGif, setPickerGif] = useState(false);
  const [content, setContent] = useState("");
  const [newComment, setNewComment] = useState(null);
  const [image, setImage] = useState(null);
  const [gif, setGif] = useState(null);
  const [displayImage, setDisplayImage] = useState(null);
  const { top, bottom } = useComponentPosition(ref);
  const { user = null } = useSelector((state) => state.auth ?? {});

  const { profileData } = useSelector((state) => state.profile);

  const shouldDisplayAbove = bottom > window.innerHeight / 2;

  const handleRemoveImage = () => {
    setImage(null);
    setGif(null);
  };

  const handleOpenInputComment = () => {
    setIsInputComment(true);
  };

  // const handleCloseInputComment = () => {
  //   setIsInputComment(false);
  //   setPickerEmoji(false);
  //   setPickerGif(false);
  // };

  const handleOpenPickerEmoji = () => {
    setPickerEmoji(!pickerEmoji);
    setIsInputComment(true);
    setPickerGif(false);
  };

  // const handleClosePickerEmoji = () => {
  //   setPickerEmoji(false);
  // };

  const handleOpenPickerGif = () => {
    setPickerGif(!pickerGif);
    setIsInputComment(true);
    setPickerEmoji(false);
  };

  // const handleClosePickerGif = () => {
  //   setPickerGif(false);
  // };

  const handleAddEmoji = (emojiObject) => {
    setContent((prevContent) => prevContent + emojiObject.emoji);
    setPickerEmoji(false);
  };

  const handleSelectGif = (gif) => {
    if (gif) {
      setGif(gif.url);
      setDisplayImage(gif.url);
      setPickerGif(false);
    } else {
      console.error("Failed to get GIF URL");
    }
  };

  const handleSelectImage = (event) => {
    const file = event.target.files[0];
    setIsInputComment(true);
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setDisplayImage(e.target.result);
        setImage(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitComment = async () => {
    if (!content && !image && !gif) return;
    let result;
    if (comment) {
      result = await dispatch(
        replyCommentPost({
          postId: post?._id,
          userId: user?._id,
          content,
          gif,
          image,
          replyToCommentId: comment?._id,
        })
      );
    } else {
      result = await dispatch(
        commentPost({
          postId: post?._id,
          userId: user?._id,
          content,
          gif,
          image,
        })
      );
    }
    getPost();
    setNewComment(result.payload.comment);
    setContent("");
    setImage(null);
    setGif(null);
    setDisplayImage(null);
    setIsInputComment(false);
    setPickerEmoji(false);
    setPickerGif(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setIsInputComment(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [inputRef]);

  return (
    <Box>
      <Stack
        direction="row"
        spacing={1}
        justifyContent="space-between"
        alignItems="center"
      >
        <Avatar src={profileData.avatar?.content?.media[0].media_url} />
        <Box
          sx={{
            background: "#f1f2f6",
            width: "100%",
            borderRadius: "1rem",
            padding: " 0.5rem",
            position: "relative",
          }}
          ref={inputRef}
        >
          <Stack
            direction={isInputComment ? "column" : "row"}
            justifyContent={isInputComment ? "start" : "space-between"}
            alignItems="center"
          >
            {isInputComment ? (
              <TextField
                fullWidth
                multiline
                placeholder="Write comment..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      border: "none",
                    },
                  },
                }}
              />
            ) : (
              <Button
                onClick={handleOpenInputComment}
                className="button-comment"
                fullWidth
              >
                <Typography
                  sx={{ width: "100%", textAlign: "start", color: "#656567" }}
                >
                  Write comment...
                </Typography>
              </Button>
            )}
            <Stack
              direction="column"
              justifyContent="start"
              sx={{ width: isInputComment ? "100%" : "auto" }}
            >
              <Stack
                ref={ref}
                direction="row"
                sx={{
                  width: isInputComment ? "100%" : "auto",
                  position: "relative",
                }}
                justifyContent="space-between"
              >
                <Stack direction="row">
                  <EmojiPicker
                    open={pickerEmoji}
                    onEmojiClick={handleAddEmoji}
                    previewConfig={{ showPreview: false }}
                    searchDisabled={true}
                    height={300}
                    style={{
                      position: "absolute",
                      zIndex: 2,
                      top: shouldDisplayAbove ? "auto" : "100%",
                      bottom: shouldDisplayAbove ? "100%" : "auto",
                    }}
                  />
                  {pickerGif && (
                    <Box
                      sx={{
                        position: "absolute",
                        zIndex: 2,
                        top: shouldDisplayAbove ? "auto" : "100%",
                        bottom: shouldDisplayAbove ? "100%" : "auto",
                      }}
                    >
                      <GifPicker
                        height={300}
                        tenorApiKey={process.env.NEXT_PUBLIC_TENOR_API_KEY}
                        onGifClick={handleSelectGif}
                      />
                    </Box>
                  )}
                  <IconButton onClick={handleOpenPickerEmoji}>
                    <InsertEmoticonIcon />
                  </IconButton>
                  <IconButton onClick={handleOpenPickerGif}>
                    <GifBoxIcon />
                  </IconButton>
                  <IconButton
                    className="choose-comment-button"
                    component="label"
                    variant="contained"
                    tabIndex={-1}
                  >
                    <CameraAltIcon />
                    <VisuallyHiddenInput
                      type="file"
                      onChange={handleSelectImage}
                    />
                  </IconButton>
                </Stack>
                {isInputComment && (
                  <IconButton onClick={handleSubmitComment}>
                    <SendIcon />
                  </IconButton>
                )}
              </Stack>
              {(image || gif) && (
                <Box mt={2} position="relative">
                  <img
                    src={displayImage}
                    alt="Selected"
                    style={{ maxWidth: "100%", borderRadius: "8px" }}
                  />
                  <IconButton
                    onClick={handleRemoveImage}
                    sx={{
                      position: "absolute",
                      width: "1.5rem",
                      height: "1.5rem",
                      fontSize: "1rem",
                      top: -10,
                      right: -10,
                      backgroundColor: "rgba(0,0,0,0.8)",
                      color: "#fff",
                    }}
                  >
                    X
                  </IconButton>
                </Box>
              )}
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
};

export default CommentBar;
