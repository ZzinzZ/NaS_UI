"use client";
import React, { useEffect, useState } from "react";
import Drawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import { styled, useTheme } from "@mui/material/styles";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import List from "@mui/material/List";
import Collapse from "@mui/material/Collapse";
import LogoutIcon from "@mui/icons-material/Logout";
import BlockIcon from "@mui/icons-material/Block";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import AddMemberBoard from "./AddMemberBoard";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import KeyIcon from "@mui/icons-material/Key";
import {
  Avatar,
  Box,
  Button,
  IconButton,
  ListItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
    deleteChat,
    getChatDetails,
    leaveChat,
    removeGroupMember,
    updateChatAvatar,
    updateChatName,
  } from "@/utils/services/chatService/chatService";
import VisuallyHiddenInput from "../generals/VisuallyHiddenInput";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const drawerWidth = 240;

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

const ChatDrawer = ({chat, open, handleDrawerClose, onUpdate, listMember, setLisMember}) => {
  const [isAddMember, setIsAddMember] = useState(false);
  const [updatingName, setUpdatingName] = useState(false);
  const [showMember, setShowMember] = useState(false);
  const [newChatName, setNewChatName] = useState("");
  const { user } = useSelector((state) => state.auth);
  const theme = useTheme();

  const handleShowMember = () => {
    setShowMember(!showMember);
  };

  const handleViewProfile = (userId) => {
    router.push(`/user/profile?id=${userId}`);
  };

  const chatDetails = async (chatId) => {
    try {
      const response = await getChatDetails({ chatId: chatId });
      setLisMember(response?.participantProfiles);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  const updateName = async () => {
    try {
      if (!newChatName || newChatName.trim() === "") {
        toast.error("Chat name cannot be empty.");
        return;
      }

      const response = await updateChatName({
        chatId: chat?._id,
        chatName: newChatName,
      });
      onUpdate(response);
      setUpdatingName(false);
    } catch (error) {
      toast.error(error.message || "Failed to update chat name.");
    }
  };

  const removeMember = async (userId) => {
    try {
      const response = await removeGroupMember({
        chatId: chat?._id,
        creatorId: user?._id,
        userId: userId,
      });
      setLisMember(response);
    } catch (error) {
      toast.error(error.message || error || "Failed to remove member.");
    }
  };

  const handleCancelUpdateChatName = () => {
    setNewChatName("");
    setUpdatingName(false);
  };

  const handleLeaveChat = async () => {
    try {
      await leaveChat({
        chatId: chat?._id,
        userId: user?._id,
      });
      toast.info("Leave chat successfully");
      router.push("/user");
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteChat = async () => {
    try {
      await deleteChat({
        chatId: chat?._id,
        userId: user._id,
      });
      toast.info("Delete chat successfully");
      router.push("/user");
    } catch (error) {
      toast.error(error.message || error || "Failed to delete chat.");
    }
  };
  const openAddMember = () => {
    setIsAddMember(true);
  };
  const closeAddMember = () => {
    setIsAddMember(false);
  };
  const changeGroupAvatar = async (event) => {
    try {
      dispatch(showLoading());
      const file = event.target.files[0];

      if (file) {
        const response = await updateChatAvatar({
          chatId: chat?._id,
          avatar: file,
        });
        onUpdate(response);
      } else {
        toast.error("Please select a valid image");
      }
    } catch (error) {
      toast.error(error);
    } finally {
      dispatch(hideLoading());
    }
  };
  useEffect(() => {
    chatDetails(chat?._id);
  }, [chat]);
  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
        },
        
        
      }}
      variant="persistent"
      anchor="right"
      open={open}
    >
      <DrawerHeader>
        <IconButton onClick={handleDrawerClose}>
          {!theme.direction === "ltr" ? (
            <ChevronLeftIcon />
          ) : (
            <ChevronRightIcon />
          )}
        </IconButton>
      </DrawerHeader>
      <Stack
        justifyContent="center"
        alignItems="center"
        spacing={1}
        sx={{ padding: "0 1rem" }}
      >
        <Stack direction="row" sx={{ position: "relative" }}>
          <Avatar src={chat?.avatar} sx={{ width: 65, height: 65 }} />
          {chat?.type === "group" && (
            <IconButton
              sx={{
                position: "absolute",
                bottom: "0rem",
                right: "0rem",
                background: "#fff",
                width: "1.5rem",
                height: "1.5rem",
              }}
              component="label"
              role={undefined}
              variant="contained"
              tabIndex={-1}
            >
              <CameraAltIcon sx={{ width: "1rem", height: "1rem" }} />
              <VisuallyHiddenInput
                type="file"
                accept="image/*"
                onChange={changeGroupAvatar}
              />
            </IconButton>
          )}
        </Stack>
        <Typography
          sx={{ fontWeight: 500, fontSize: "0.8rem", color: "#686b68" }}
        >
          {chat?.type === "private" ? "nick name" : "group name"}
        </Typography>
        {!updatingName ? (
          <Stack direction="row" alignItems="center">
            <Typography variant="h6">{chat?.chat_name}</Typography>
            <IconButton onClick={() => setUpdatingName(true)}>
              <BorderColorIcon sx={{ fontSize: "1rem" }} />
            </IconButton>
          </Stack>
        ) : (
          <Stack spacing={1}>
            <TextField
              value={newChatName}
              onChange={(e) => setNewChatName(e.target.value)}
            />
            <Stack direction="row" spacing={1} justifyContent="end">
              <Button variant="contained" onClick={updateName}>
                Save
              </Button>
              <Button variant="contained" onClick={handleCancelUpdateChatName}>
                Cancel
              </Button>
            </Stack>
          </Stack>
        )}
        {chat?.type === "private" && (
          <Stack spacing={1} sx={{ width: "100%" }}>
            <Button
              fullWidth
              variant="contained"
              onClick={() => handleViewProfile(chat?.participants[0].userId)}
            >
              View profile
            </Button>
            <Button
              variant="outlined"
              color="error"
              fullWidth
              endIcon={<BlockIcon sx={{ color: "#d32f2f" }} />}
            >
              Block
            </Button>
          </Stack>
        )}
        {chat?.type === "group" && (
          <Stack sx={{ width: "100%" }} spacing={1}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography
                sx={{
                  fontWeight: "500",
                  color: "#686b68",
                  fontSize: "0.8rem",
                }}
              >
                {listMember?.length} Member
              </Typography>
              {showMember ? (
                <IconButton onClick={handleShowMember}>
                  {" "}
                  <ExpandLess />
                </IconButton>
              ) : (
                <IconButton onClick={handleShowMember}>
                  {" "}
                  <ExpandMore />
                </IconButton>
              )}
            </Stack>
            <Collapse in={showMember} timeout="auto" unmountOnExit>
              <AddMemberBoard
                open={isAddMember}
                handleClose={closeAddMember}
                chat={chat}
              />
              <List component="div" disablePadding>
                <Button
                  fullWidth
                  variant="contained"
                  endIcon={<PersonAddAlt1Icon />}
                  onClick={openAddMember}
                >
                  Add member
                </Button>
                {listMember?.map((member, index) => (
                  <ListItem key={member._id}>
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                      sx={{ width: "100%" }}
                    >
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Avatar
                          src={member.avatar?.content?.media[0].media_url}
                          sx={{ width: 20, height: 20 }}
                        />
                        <Typography>{member.userName}</Typography>
                      </Stack>

                      {index !== 0 ? (
                        user?._id === chat?.created_by ? (
                          <IconButton
                            onClick={() => removeMember(member.userId)}
                          >
                            <LogoutIcon sx={{ color: "#d32f2f" }} />
                          </IconButton>
                        ) : null
                      ) : (
                        <KeyIcon sx={{ color: "#f9b828" }} />
                      )}
                    </Stack>
                  </ListItem>
                ))}
              </List>
            </Collapse>
            <Button
              variant="outlined"
              color="error"
              fullWidth
              endIcon={<LogoutIcon sx={{ color: "#d32f2f" }} />}
              onClick={handleLeaveChat}
            >
              Leave chat
            </Button>
            {user._id === chat.created_by && (
              <Button
                variant="outlined"
                color="error"
                fullWidth
                onClick={handleDeleteChat}
              >
                Delete group
              </Button>
            )}
          </Stack>
        )}
      </Stack>
    </Drawer>
  );
};

export default ChatDrawer;
