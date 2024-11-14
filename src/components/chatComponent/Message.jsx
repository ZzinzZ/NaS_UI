import React, { useState, memo, useCallback, useEffect } from "react";
import {
  Avatar,
  AvatarGroup,
  Box,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import AddReactionIcon from "@mui/icons-material/AddReaction";
import ReplyIcon from "@mui/icons-material/Reply";
import { useSelector } from "react-redux";
import moment from "moment";
import ReactSelector from "../generals/ReactSelector";
import { reactMessage } from "@/utils/services/messageService/message.service";
import { useSocket } from "@/contexts/SocketContext";

const Message = memo(({ message }) => {
  const { user } = useSelector((state) => state.auth);
  const [reacted, setReacted] = useState(false);
  const [openReact, setOpenReact] = useState(false);
  const { handleReactMessage, handleReadMessage } = useSocket();
  const isSentByCurrentUser = message?.sender_id === user?._id;

  const sortedReacts = message?.react?.reduce((acc, react) => {
    acc[react.emotion] = (acc[react.emotion] || 0) + 1;
    return acc;
  }, {});

  const sortedReactTypes = sortedReacts
    ? Object.entries(sortedReacts)
        .sort((a, b) => b[1] - a[1])
        .map(([type]) => type)
    : [];

  const handleOpenReact = () => {
    setOpenReact(!openReact);
  };

  const reactMessage = (key) => {
    handleReactMessage(message?._id, user?._id, key);
    setReacted(!reacted);
  };

  useEffect(() => {
    handleReadMessage(message)
    console.log(message);
    
  },[])


  return (
    <Stack
      direction="row"
      justifyContent={isSentByCurrentUser ? "flex-end" : "flex-start"}
      sx={{ padding: "0.5rem" }}
    >
      <Stack direction="row" spacing={1} alignItems="end">
        {/* {!isSentByCurrentUser && <Avatar />} */}
        <Stack>
          {!isSentByCurrentUser && <Typography sx={{color:"#64686b", fontSize:"0.8rem"}}>{message?.sender_id?.name}</Typography>}
          <Box
            sx={{
              backgroundColor: isSentByCurrentUser ? "#1976d3" : "#fff",
              color: isSentByCurrentUser ? "#fff" : "#000",
              padding: "0.8rem",
              borderRadius: "10px",
              position: "relative",
              wordWrap: "break-word",
              "&:hover .message-icons": { opacity: 1 },
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Stack sx={{ width: "100%" }}>
              {message?.content.text && (
                <Typography>{message?.content.text}</Typography>
              )}
              {message?.content.image?.map((image, index) => (
                <Image
                  src={image}
                  key={index}
                  alt="message"
                  width={100}
                  height={100}
                />
              ))}
              {message?.content.file && (
                <Link href={message?.content.file} download>
                  Download File
                </Link>
              )}
              <Typography sx={{ color: "#ccc", fontSize: "0.7rem" }}>
                {moment(message?.createdAt).calendar()}
              </Typography>
              <Box>
                <AvatarGroup max={7}>
                  {sortedReactTypes.map((type, index) => (
                    <Avatar
                      key={index}
                      sx={{ width: 18, height: 18, background: "#fff" }}
                      src={`/${type}.png`}
                    />
                  ))}
                </AvatarGroup>
              </Box>
            </Stack>
            <Box
              className="message-icons"
              sx={{
                position: "absolute",
                bottom: "0",
                right: isSentByCurrentUser ? "auto" : "-4.7rem",
                left: isSentByCurrentUser ? "-4.7rem" : "auto",
                display: "flex",
                gap: "0.5rem",
                opacity: 0,
                transition: "opacity 0.3s ease-in-out",
              }}
            >
              <IconButton
                size="small"
                sx={{ color: "#666", position: "relative" }}
                onClick={handleOpenReact}
              >
                {openReact && (
                  <ReactSelector handleReact={reactMessage} />
                )}
                <AddReactionIcon />
              </IconButton>
              <IconButton size="small" sx={{ color: "#666" }}>
                <ReplyIcon />
              </IconButton>
            </Box>
          </Box>
        </Stack>
      </Stack>
    </Stack>
  );
});

export default Message;
