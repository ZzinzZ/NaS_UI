"use client";
import {
  IconButton,
  Popover,
  Stack,
  TextField,
  Button,
  Box,
  Typography,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from "@mui/icons-material/Send";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import EmojiPicker from "emoji-picker-react";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useSocket } from "@/contexts/SocketContext";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import ImageIcon from "@mui/icons-material/Image";

const InputChat = ({ chat }) => {
  const [anchorEl, setAnchorEl] = useState(null); 
  const [emojiAnchorEl, setEmojiAnchorEl] = useState(null);
  const [chatContent, setChatContent] = useState("");
  const [images, setImages] = useState([]);
  const { user } = useSelector((state) => state.auth);
  const { handleSendMessage } = useSocket();

  const onEmojiClick = (emojiObject, event) => {
    setChatContent((prev) => prev + emojiObject.emoji);
  };

  const handleEmojiPickerOpen = (event) => {
    setEmojiAnchorEl(event.currentTarget);
  };

  const handleEmojiPickerClose = () => {
    setEmojiAnchorEl(null);
  };

  const handleInputMessage = (event) => {
    setChatContent(() => event.target.value);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleImageChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setImages((prevImages) => [...prevImages, ...selectedFiles]);
    handleMenuClose();
  };

  const removeImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const openEmojiPicker = Boolean(emojiAnchorEl);
  const openMenu = Boolean(anchorEl);

  return (
    <Stack>
       <Stack direction="row" spacing={1} sx={{padding:"0.5rem 0 0rem 5rem"}}>
       {images.length > 0 &&
          images.map((image, index) => (
            <Stack key={index} sx={{position:"relative",width: "4rem", height: "4rem"}}>
              <img
              src={URL.createObjectURL(image)}
              alt="uploaded image"
              style={{
                borderRadius:"0.5rem",
                width: "100%",
                height: "100%",
                objectFit: "cover", 
              }}
            />
            <IconButton
                onClick={() => removeImage(index)}
                sx={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  color: "white",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.7)" },
                  padding: "4px",
                }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Stack>
          ))}
       </Stack>
      <Stack
      direction="row"
      alignItems="center"
      sx={{ padding: "0.5rem 0.5rem" }}
    >
      <IconButton
        onClick={handleMenuOpen}
        sx={{
          transition: "transform 0.3s",
          transform: openMenu ? "rotate(45deg)" : "rotate(0deg)",
        }}
      >
        <AddCircleIcon sx={{ color: "#1976d3" }} />
      </IconButton>

      <Popover
        open={openMenu}
        anchorEl={anchorEl}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: "right",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
            padding: "1rem",
          }}
        >
          <Stack sx={{ color: "#1976d3", padding: "0.5rem", borderRadius: "0.5rem", "&:hover": { backgroundColor: "#f2f2f2" } }}>
            <input
              type="file"
              multiple
              style={{ display: "none" }}
              id="attach-files"
              onChange={handleImageChange}
            />
            <label htmlFor="attach-files">
              <Stack direction="row" alignItems="center" spacing={1}>
                <AttachFileIcon />
                <Typography variant="body2">Attach file</Typography>
              </Stack>
            </label>
          </Stack>

          <Stack sx={{ color: "#1976d3", padding: "0.5rem", borderRadius: "0.5rem", "&:hover": { backgroundColor: "#f2f2f2" } }}>
            <input
              accept="image/*"
              type="file"
              multiple
              style={{ display: "none" }}
              id="upload-images"
              onChange={handleImageChange}
            />
            <label htmlFor="upload-images">
              <Stack direction="row" alignItems="center" spacing={1}>
                <ImageIcon />
                <Typography variant="body2">Image</Typography>
              </Stack>
            </label>
          </Stack>
        </Box>
      </Popover>

      <Stack
        direction="row"
        alignItems="center"
        justifyContent="center"
        sx={{
          width: "90%",
          background: "#EAEAEA",
          borderRadius: "1rem",
          height: "2.5rem",
          padding: "0.5rem 0.8rem",
        }}
      >
        <TextField
          autoComplete="off"
          placeholder="Type a message..."
          value={chatContent}
          onChange={(e) => handleInputMessage(e)}
          sx={{
            width: "100%",
            height: "2rem",
            padding: "0 0.2rem !important",
            "& .MuiOutlinedInput-root": {
              display: "flex",
              alignItems: "center",
              padding: "0 !important",
              height: "100%",
              "& input": {
                padding: "4px 0 0 0",
                display: "flex",
                alignItems: "flex-end",
                height: "100%",
              },
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
          }}/>
        <IconButton onClick={handleEmojiPickerOpen}>
          <EmojiEmotionsIcon sx={{ color: "#1976d3" }} />
        </IconButton>
        <Popover
          open={openEmojiPicker}
          anchorEl={emojiAnchorEl}
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
      </Stack>
      <IconButton
        onClick={() =>
          handleSendMessage(chatContent, user?._id, chat?._id, setChatContent, images, setImages)
        }
      >
        <SendIcon sx={{ color: "#1976d3" }} />
      </IconButton>
    </Stack>
    </Stack>
  );
};

export default InputChat;
