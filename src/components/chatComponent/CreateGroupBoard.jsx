"use client";
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Dialog,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import GroupsIcon from "@mui/icons-material/Groups";
import CloseIcon from "@mui/icons-material/Close";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getListFriends } from "@/utils/services/profileService/getListFriend";
import { createGroupChat } from "@/utils/services/chatService/chatService";
import InboxIcon from '@mui/icons-material/Inbox';
import { useSocket } from "@/contexts/SocketContext";

const CreateGroupBoard = ({ open, handleClose, reloadChat }) => {
  const { user } = useSelector((state) => state.auth);
  const { createChatSocket } = useSocket();
  const [listFriend, setListFriend] = useState([]);
  const [selectedMember, setSelectedMember] = useState([]);
  const [groupName, setGroupName] = useState("");

  // Lấy danh sách bạn bè
  const getListFriend = async () => {
    try {
      const response = await getListFriends({ userId: user?._id });
      setListFriend(response);
    } catch (error) {
      console.log(error);
    }
  };

  // Xử lý chọn và hủy chọn thành viên
  const handleSelectMember = (friendId) => {
    setSelectedMember((prevSelected) =>
      prevSelected.includes(friendId)
        ? prevSelected.filter((id) => id !== friendId)
        : [...prevSelected, friendId]
    );
  };

  // Xử lý nhập tên nhóm
  const handleGroupNameChange = (event) => {
    setGroupName(event.target.value);
  };

  const createGroup = async () => {
    try {
      const response = await createGroupChat({
        userId: user._id,
        participants: selectedMember,
        chatName: groupName,
      });
      reloadChat();
      setGroupName("");
      createChatSocket(response, selectedMember);
      setSelectedMember([]);
      handleClose();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getListFriend();
  }, [user]);

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
        {/* Header */}
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
            sx={{ padding: "0 1rem" }}
          >
            <GroupsIcon />
            <Typography>Create group</Typography>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Stack>
        </Box>

        {/* Main content */}
        <Box
          sx={{
            flexGrow: 1,
            overflowY: "auto",
            padding: "1rem",
            backgroundColor: "#fff",
            paddingTop: "1rem",
          }}
        >
          <Stack spacing={2}>
            {/* Tên nhóm */}
            <Stack direction="row" spacing={1} alignItems="end">
              <Typography
                sx={{
                  fontWeight: "500",
                  color: "#686b68",
                  fontSize: "0.8rem",
                }}
              >
                Group name:
              </Typography>
              <TextField
                autoComplete="off"
                variant="standard"
                value={groupName}
                onChange={handleGroupNameChange}
              />
            </Stack>

            {/* Danh sách bạn bè */}
            <Typography
              sx={{
                fontWeight: "500",
                color: "#686b68",
                fontSize: "0.8rem",
              }}
            >
              Add member:
            </Typography>

            {listFriend?.map((friend) => (
              <Box
                key={friend.userId}
                sx={{
                  padding: "0.5rem 1rem",
                  borderBottom: "1px solid #eaeaea",
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: "#f1f2f6",
                  },
                }}
              >
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Avatar src={friend.avatar?.content?.media[0].media_url} />
                    <Typography>{friend.userName}</Typography>
                  </Stack>
                  <Checkbox
                    checked={selectedMember.includes(friend.userId)}
                    onChange={() => handleSelectMember(friend.userId)}
                  />
                </Stack>
              </Box>
            ))}
          </Stack>
        </Box>

        {/* Footer */}
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
          <Stack
            direction="row"
            spacing={2}
            sx={{ width: "100%", padding: "0 1rem" }}
            alignItems="center"
            justifyContent="space-around"
          >
            <Button
              variant="contained"
              className="grey-profile-button"
              fullWidth
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              fullWidth
              onClick={createGroup}
              disabled={ selectedMember.length < 2}
            >
              Create
            </Button>
          </Stack>
        </Box>
      </Stack>
    </Dialog>
  );
};

export default CreateGroupBoard;
