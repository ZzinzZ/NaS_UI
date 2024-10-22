import React, { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Container,
  Dialog,
  IconButton,
  Popover,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CollectionsIcon from "@mui/icons-material/Collections";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import GifBoxIcon from "@mui/icons-material/GifBox";
import EmojiPicker from "emoji-picker-react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { createPost } from "@/utils/services/postService/PostFeature";

const CreatePostBoard = ({ open, handleClose, onNew, profile }) => {
  const { user } = useSelector((state) => state.auth);
  const [content, setContent] = useState("");
  const [pictures, setPictures] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null); 

  const handlePostSubmit = async () => {
    if (!content && pictures.length === 0) {
      toast.error("Please write something or add a picture.");
      return;
    }

    try {
      await createPost({
        userId: user._id,
        content,
        files: pictures,
      });
      onNew();
      handleClose();
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const handleFileChange = (e) => {
    setPictures((prevPictures) => [
      ...prevPictures,
      ...Array.from(e.target.files),
    ]);
  };

  const handleRemovePicture = (index) => {
    setPictures((prevPictures) => prevPictures.filter((_, i) => i !== index));
  };

  const onEmojiClick = (emojiObject, event) => {
    setContent((prevContent) => prevContent + emojiObject.emoji);
    
  };

  const handleEmojiPickerOpen = (event) => {
    setAnchorEl(event.currentTarget); 
  };

  const handleEmojiPickerClose = () => {
    setAnchorEl(null); // Đóng EmojiPicker
  };

  const openEmojiPicker = Boolean(anchorEl); // Kiểm tra trạng thái mở của EmojiPicker

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      disableScrollLock={true}
      PaperProps={{
        sx: {
          width: "40vw",
          maxWidth: "none",
          height: "80vh",
        },
      }}
    >
      <Stack sx={{ background: "#fff", height: "100%" }}>
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
            justifyContent="space-between"
            alignItems="center"
          >
            <Stack></Stack>
            <Typography variant="h8">Create Post</Typography>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Stack>
        </Box>

        <Box
          sx={{
            flexGrow: 1,
            overflowY: "auto",
            padding: "1rem",
            backgroundColor: "#fff",
            paddingTop: "1rem",
          }}
        >
          <Stack justifyContent="space-between" sx={{ height: "100%" }}>
            <Stack spacing={2}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Avatar src={profile.avatar?.content?.media[0].media_url}/>
                <Typography>{user?.name}</Typography>
              </Stack>
              <TextField
                multiline
                placeholder="What are you thinking?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    border: "none",
                    "& fieldset": {
                      border: "none",
                    },
                    "&:hover fieldset": {
                      border: "none",
                    },
                    "&.Mui-focused fieldset": {
                      border: "none",
                    },
                  },
                }}
              />

              <Stack direction="row" spacing={2} sx={{ flexWrap: "wrap" }}>
                {pictures.map((picture, index) => (
                  <Box
                    key={index}
                    sx={{
                      position: "relative",
                      display: "inline-block",
                      width: 100,
                      height: 100,
                      margin: 1,
                    }}
                  >
                    <img
                      src={URL.createObjectURL(picture)}
                      alt="preview"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                    />
                    <IconButton
                      size="small"
                      onClick={() => handleRemovePicture(index)}
                      sx={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        color: "#fff",
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        "&:hover": {
                          backgroundColor: "rgba(0, 0, 0, 0.7)",
                        },
                      }}
                    >
                      <CloseIcon />
                    </IconButton>
                  </Box>
                ))}
              </Stack>
            </Stack>

            <Stack
              direction="row"
              spacing={1}
              justifyContent="space-between"
              alignItems="center"
              sx={{
                border: "0.2px solid #dedfe4",
                padding: "0.5rem",
                borderRadius: "0.5rem",
              }}
            >
              <Typography variant="h7">Add to your post</Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <Stack>
                  <input
                    accept="image/*"
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                    id="upload-pictures"
                  />
                  <label htmlFor="upload-pictures">
                    <IconButton component="span">
                      <CollectionsIcon sx={{ color: "#49bb64" }} />
                    </IconButton>
                  </label>
                </Stack>
                <IconButton onClick={handleEmojiPickerOpen}>
                  <EmojiEmotionsIcon sx={{ color: "#f9b828" }} />
                </IconButton>

                {/* Popover Emoji Picker */}
                <Popover
                  open={openEmojiPicker}
                  anchorEl={anchorEl}
                  onClose={handleEmojiPickerClose}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "center",
                  }}
                  transformOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                >
                  <EmojiPicker
                    onEmojiClick={onEmojiClick}
                    searchDisabled={true}
                    height={300}
                    emojiStyle="facebook"
                    previewConfig={{
                      showPreview: false,
                    }}
                  />
                </Popover>

                {/* <IconButton>
                  <GifBoxIcon sx={{ color: "#2bb99f" }} />
                </IconButton> */}
              </Stack>
            </Stack>
          </Stack>
        </Box>

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
          <Container>
            <Button variant="contained" fullWidth onClick={handlePostSubmit}>
              Upload
            </Button>
          </Container>
        </Box>
      </Stack>
    </Dialog>
  );
};

export default CreatePostBoard;
