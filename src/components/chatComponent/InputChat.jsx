"use client";
import { IconButton, Popover, Stack, TextField } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import SendIcon from "@mui/icons-material/Send";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import EmojiPicker from "emoji-picker-react";
import React, { useState } from "react";

const InputChat = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [content, setContent] = useState("");

    const onEmojiClick = (emojiObject, event) => {
        setContent((prevContent) => prevContent + emojiObject.emoji);
        
      };
    
      const handleEmojiPickerOpen = (event) => {
        setAnchorEl(event.currentTarget); 
      };
    
      const handleEmojiPickerClose = () => {
        setAnchorEl(null); // Đóng EmojiPicker
      };
    
      const openEmojiPicker = Boolean(anchorEl);
  return (
    <Stack
      direction="row"
      alignItems="center"
      sx={{ padding: "0.5rem 0.5rem" }}
    >
      <IconButton>
        <AddCircleIcon sx={{ color: "#1976d3" }} />
      </IconButton>
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
          sx={{
            width: "100%",
            height: "2rem",
            padding: "0 0.2rem !important",
            "& .MuiOutlinedInput-root": {
              display: "flex",
              alignItems: "center", 
              padding: "0 !important", // Bỏ padding mặc định
              height: "100%",
              "& input": {
                padding: "4px 0 0 0", 
                display: "flex",
                alignItems: "flex-end", 
                height: "100%",
              },
              "& fieldset": {
                border: "none", // Xóa viền
              },
              "&:hover fieldset": {
                border: "none", // Xóa viền khi hover
              },
              "&.Mui-focused fieldset": {
                border: "none", // Xóa viền khi focus
              },
            },
          }}
        />
        <IconButton onClick={handleEmojiPickerOpen}>
          <EmojiEmotionsIcon sx={{ color: "#1976d3" }} />
        </IconButton>
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
      </Stack>
      <IconButton>
        <SendIcon sx={{ color: "#1976d3" }} />
      </IconButton>
    </Stack>
  );
};

export default InputChat;
