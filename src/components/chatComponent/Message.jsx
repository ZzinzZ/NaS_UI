"use client";
import React, { useState, useEffect, forwardRef, useCallback } from "react";
import {
  Avatar,
  AvatarGroup,
  Box,
  CircularProgress,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import Image from "next/image";
import CallIcon from "@mui/icons-material/Call";
import PhoneMissedIcon from "@mui/icons-material/PhoneMissed";
import PhoneDisabledIcon from "@mui/icons-material/PhoneDisabled";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import AddReactionIcon from "@mui/icons-material/AddReaction";
import ReplyIcon from "@mui/icons-material/Reply";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import ReactSelector from "../generals/ReactSelector";
import { useSocket } from "@/contexts/SocketContext";
import {
  deleteSoftMessage,
  getUserReactMessage,
  getUserSeenMessage,
} from "@/utils/services/messageService/message.service";
import formatBytes from "@/utils/middlewares/formatBytes";
import Link from "next/link";
import { formatCallDuration } from "@/utils/middlewares/formatTimes";
import { showImage } from "@/redux/slices/imageSlice";

const Message = React.forwardRef(
  (
    {
      message,
      scrollToMessage,
      setRefMessage,
      isBlockedBy,
      isSearchResult,
      isCurrentSearchResult,
    },
    ref
  ) => {
    const { user = null } = useSelector((state) => state.auth ?? {});

    const [reacted, setReacted] = useState(false);
    const [openReact, setOpenReact] = useState(false);
    const [listSeen, setListSeen] = useState([]);
    const [listReact, setListReact] = useState([]);
    const [openSeenList, setOpenSeenList] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const {
      handleReactMessage,
      handleReadMessage,
      handleRemoveMessage,
      newMessage,
      onDeleteMessage,
    } = useSocket();
    const dispatch = useDispatch();
    const isSentByCurrentUser =
      message?.sender_id?._id === user?._id || message?.sender_id === user?._id;

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

    const reactMessage = async (key) => {
      await handleReactMessage(message?._id, user?._id, key);
      handleGetListReact();
      setReacted(!reacted);
    };

    const handleGetListSeen = async () => {
      const response = await getUserSeenMessage({ messageId: message?._id });
      setListSeen(response);
    };

    const handleGetListReact = async () => {
      const response = await getUserReactMessage({ messageId: message?._id });
      setListReact(response);
    };

    const handleDeleteSoftMessage = async () => {
      await deleteSoftMessage({
        messageId: message?._id,
        userId: user?._id,
      });
      onDeleteMessage(message?._id);
      handleMenuClose();
    };

    const onRefMessage = () => {
      setRefMessage(message);
    };

    const handleMenuOpen = useCallback((event) => {
      setAnchorEl(event.currentTarget);
    }, []);

    const handleMenuClose = useCallback(() => {
      setAnchorEl(null);
    }, []);

    const handleRemoveMessageClick = async () => {
      await handleRemoveMessage(user?._id, message?._id);
      handleMenuClose();
    };

    useEffect(() => {
      handleReadMessage(message);
      handleGetListSeen();
      handleGetListReact();
    }, [newMessage]);

    const handleSetFileIcon = (type) => {
      if (type.includes("image")) return "/image.png";
      else if (type.includes("word")) return "/word.png";
      else if (type.includes("pdf")) return "/pdf.png";
      else if (type.includes("excel") || type.includes("spreadsheetml"))
        return "/excel.png";
      else if (type.includes("powerpoint") || type.includes("presentationml"))
        return "/video.png";
      else return "/other-file.png";
    };
    return (
      <Stack
        direction="row"
        justifyContent={isSentByCurrentUser ? "flex-end" : "flex-start"}
        sx={{ padding: "0.5rem" }}
        ref={ref}
      >
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
        >
          {isSentByCurrentUser && (
            <MenuItem
              onClick={handleRemoveMessageClick}
              sx={{ fontSize: "0.8rem" }}
            >
              Remove for everyone
            </MenuItem>
          )}
          <MenuItem
            sx={{ fontSize: "0.8rem" }}
            onClick={handleDeleteSoftMessage}
          >
            Remove for you
          </MenuItem>
        </Menu>
        <Stack direction="row" spacing={1} alignItems="end">
          <Stack>
            {!isSentByCurrentUser && (
              <Typography sx={{ color: "#64686b", fontSize: "0.8rem" }}>
                {message?.sender_id?.name}
              </Typography>
            )}
            {!message?.isRemoved ? (
              <Box
                onContextMenu={(event) => {
                  event.preventDefault();
                  handleMenuOpen(event);
                }}
                onClick={() => setOpenSeenList(!openSeenList)}
                ref={ref}
                sx={{
                  border: isCurrentSearchResult ? "3px solid #46c8f9" : "none",
                  transition: "border 0.3s ease",
                  transition: "background-color 0.3s ease",
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
                {message?.reply_to && (
                  <Stack
                    onClick={() => scrollToMessage(message.reply_to._id)}
                    sx={{
                      backgroundColor: "rgba(241, 242, 246, 0.6)",
                      borderRadius: "0.2rem",
                      padding: "0 1rem",
                      color: "#64686b",
                      cursor: "pointer",
                    }}
                  >
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography sx={{ fontSize: "0.8rem" }}>
                        {"Reply to "}
                      </Typography>
                      <Typography
                        sx={{ fontWeight: "600", fontSize: "0.8rem" }}
                      >
                        {message?.reply_to.sender_id?.name}
                      </Typography>
                    </Stack>
                    <Typography
                      sx={{
                        maxWidth: "20rem", // Giới hạn chiều rộng
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {message?.reply_to?.content?.image?.length > 0
                        ? "Image"
                        : message?.reply_to?.content?.file
                        ? "File"
                        : message?.reply_to?.content?.text}
                    </Typography>
                  </Stack>
                )}
                <Stack sx={{ width: "100%" }}>
                  {message?.content?.call &&
                    (message?.content?.call?.is_accepted ? (
                      <Stack direction="row" spacing={1}>
                        {message?.content?.call?.call_type === "audio" ? (
                          <CallIcon />
                        ) : (
                          <VideocamIcon />
                        )}
                        <Stack>
                          {message?.content?.call?.call_type === "audio" ? (
                            <Typography>Audio call</Typography>
                          ) : (
                            <Typography>Video call</Typography>
                          )}
                          <Typography sx={{ fontSize: "0.8rem" }}>
                            {formatCallDuration(
                              message?.content?.call?.callDuration
                            )}
                          </Typography>
                        </Stack>
                      </Stack>
                    ) : (
                      <Stack
                        direction="row"
                        sx={{ color: isSentByCurrentUser ? "#ccc" : "#f44336" }}
                      >
                        {message?.content?.call?.call_type === "audio" ? (
                          <PhoneDisabledIcon />
                        ) : (
                          <VideocamOffIcon />
                        )}
                        <Stack>
                          {message?.content?.call?.call_type === "audio" ? (
                            <Typography>Audio call</Typography>
                          ) : (
                            <Typography>Video call</Typography>
                          )}
                        </Stack>
                      </Stack>
                    ))}
                  {message?.content.text && (
                    <Typography
                      sx={{
                        maxWidth: "20rem", // Giới hạn chiều rộng
                        wordWrap: "break-word",
                      }}
                    >
                      {message?.content.text}
                    </Typography>
                  )}
                  {message?.isLoading ? (
                    // Nếu message đang trong quá trình tải, hiển thị "Loading..."
                    <Stack
                      justifyContent="center"
                      alignItems="center"
                      sx={{
                        width: "10rem",
                        height: "10rem",
                        backgroundColor: "rgba(255,255,255,0.1)",
                        backdropFilter: "blur(10px)",
                      }}
                    >
                      <CircularProgress sx={{ color: "#fff" }} />
                    </Stack>
                  ) : (
                    message?.content?.image?.length > 0 &&
                    (message?.content?.image?.length === 1 ? (
                      // Trường hợp chỉ có 1 ảnh
                      <Box
                        sx={{
                          position: "relative",
                          width: "10rem",
                          height: "auto",
                          paddingTop: "56.25%",
                        }}
                      >
                        {" "}
                        {/* Tỷ lệ 16:9 */}
                        <Image
                          src={message?.content?.image[0]}
                          alt="message-image-single"
                          fill
                          style={{ objectFit: "cover", borderRadius: "8px" }}
                          onClick={() => {
                            dispatch(showImage(message?.content?.image[0]));
                          }}
                        />
                      </Box>
                    ) : message?.content?.image?.length === 2 ? (
                      // Trường hợp có 2 ảnh
                      <Box
                        sx={{
                          display: "grid",
                          gridTemplateColumns: "repeat(2, 1fr)", // Hai ảnh chia đều theo chiều rộng
                          gap: 0.5,
                          maxWidth: 320,
                        }}
                      >
                        {message.content.image.map((image, index) => (
                          <Box
                            key={index}
                            sx={{
                              position: "relative",
                              width: "100%",
                              paddingTop: "100%",
                              width: "8rem",
                              height: "8rem",
                            }}
                          >
                            <Image
                              src={image}
                              alt={`message-image-${index}`}
                              fill
                              style={{
                                objectFit: "cover",
                                borderRadius: "8px",
                              }}
                              onClick={() => {
                                dispatch(showImage(image));
                              }}
                            />
                          </Box>
                        ))}
                      </Box>
                    ) : (
                      <Box
                        sx={{
                          display: "grid",
                          gridTemplateColumns:
                            "repeat(auto-fill, minmax(6rem, 1fr))",
                          gap: 0.5,
                          maxWidth: 320,
                        }}
                      >
                        {message.content?.image?.map((image, index) => (
                          <Box
                            key={index}
                            sx={{
                              position: "relative",
                              width: "100%",
                              paddingTop: "100%",
                            }}
                          >
                            <Image
                              src={image}
                              alt={`message-image-${index}`}
                              fill
                              style={{
                                objectFit: "cover",
                                borderRadius: "4px",
                              }}
                              onClick={() => {
                                dispatch(showFile(image));
                              }}
                            />
                          </Box>
                        ))}
                      </Box>
                    ))
                  )}
                  {message?.content.file && (
                    <Stack spacing={0.3}>
                      {message?.content?.file?.map((file) => (
                        <Link
                          href={`${process.env.NEXT_PUBLIC_BACKEND_FILE_URL}/${file?.filePath}`}
                          key={file?._id}
                        >
                          <Stack
                            key={file?._id}
                            direction="row"
                            alignItems="center"
                            sx={{
                              background: "rgba(255,255,255,0.2)",
                              padding: "0.5rem",
                              borderRadius: "0.5rem",
                            }}
                          >
                            <Image
                              src={handleSetFileIcon(file?.fileType)}
                              width={50}
                              height={50}
                              alt={file?.fileName}
                            />
                            <Stack>
                              <Typography
                                sx={{
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  maxWidth: "15rem", // Chiều rộng tối đa để tên bị cắt
                                }}
                              >
                                {file?.fileName}
                              </Typography>
                              <Typography sx={{ fontSize: "0.7rem" }}>
                                {formatBytes(file?.fileSize)}
                              </Typography>
                            </Stack>
                          </Stack>
                        </Link>
                      ))}
                    </Stack>
                  )}
                  <Box
                    sx={{ position: "absolute", bottom: "-0.8rem", right: 0 }}
                  >
                    <AvatarGroup max={7}>
                      {sortedReactTypes.map((type, index) => (
                        <Tooltip
                          key={index}
                          title={listReact
                            ?.filter((react) => react.emotion === type)
                            .map((user) => user.userId.name)
                            .join(", ")}
                          arrow
                          placement="top"
                        >
                          <Avatar
                            sx={{ width: 18, height: 18, background: "#fff" }}
                            src={`/${type}.png`}
                          />
                        </Tooltip>
                      ))}
                    </AvatarGroup>
                  </Box>
                  <Typography sx={{ color: "#ccc", fontSize: "0.7rem" }}>
                    {moment(message?.createdAt).calendar()}
                  </Typography>
                </Stack>
                <Box
                  className="message-icons"
                  sx={{
                    position: "absolute",
                    bottom: "0",
                    right: isSentByCurrentUser ? "auto" : "-4.8rem",
                    left: isSentByCurrentUser ? "-4.9rem" : "auto",
                    display: "flex",
                    gap: "0.5rem",
                    opacity: 0,
                    transition: "opacity 0.3s ease-in-out",
                  }}
                >
                  <IconButton
                    disabled={isBlockedBy}
                    size="small"
                    sx={{ color: "#666", position: "relative" }}
                    onClick={handleOpenReact}
                  >
                    {openReact && <ReactSelector handleReact={reactMessage} />}
                    <AddReactionIcon />
                  </IconButton>
                  <IconButton
                    disabled={isBlockedBy}
                    size="small"
                    sx={{ color: "#666" }}
                    onClick={onRefMessage}
                  >
                    <ReplyIcon />
                  </IconButton>
                </Box>
              </Box>
            ) : (
              <Stack
                sx={{
                  border: "1px solid #ccc",
                  padding: "0.5rem 1rem",
                  borderRadius: "0.5rem",
                }}
              >
                <Typography sx={{ color: "#ccc" }}>
                  The message has been removed
                </Typography>
              </Stack>
            )}
            {openSeenList && (
              <AvatarGroup
                sx={{
                  display: "flex",
                  justifyContent: "left",
                  marginTop: "5px",
                  transition: "ease-in-out",
                }}
                total={listReact?.length}
                max={7}
              >
                {listSeen?.map((seen) => (
                  <Tooltip key={seen?._id} title={seen.userName}>
                    <Avatar
                      src={seen.avatar?.content?.media[0].media_url}
                      sx={{ width: "1rem", height: "1rem" }}
                    />
                  </Tooltip>
                ))}
              </AvatarGroup>
            )}
          </Stack>
        </Stack>
      </Stack>
    );
  }
);

export default Message;
