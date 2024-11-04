import {
  Avatar,
  Box,
  Dialog,
  IconButton,
  Stack,
  TextField,
  Typography,
  Checkbox,
  Button,
} from "@mui/material";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getListFriends } from "@/utils/services/profileService/getListFriend";

const AddMemberBoard = ({ open, handleClose, chat }) => {
  const { user } = useSelector((state) => state.auth);
  const [listFriend, setListFriend] = useState([]);

  const getListFriend = async () => {
    try {
      const response = await getListFriends({ userId: user?._id });
      setListFriend(response);
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
          <Stack>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ padding: "0 1rem" }}
            >
              <PersonAddAlt1Icon sx={{ color: "#797979" }} />
              <Typography>Add member</Typography>
              <IconButton onClick={handleClose}>
                <CloseIcon />
              </IconButton>
            </Stack>
            <Stack sx={{ width: "100%", padding: "0 1rem" }}>
              <Stack
                direction="row"
                alignItems="center"
                sx={{
                  borderRadius: "0.5rem",
                  padding: "0 0.5rem 0 1rem",
                  background: "#EAEAEA",
                  height: "2.5rem",
                }}
              >
                <TextField
                  autoComplete="off"
                  placeholder="Search..."
                  sx={{
                    width: "100%",
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
                <IconButton>
                  <SearchIcon sx={{ color: "#5e5e5e", fontSize: "1.5rem" }} />
                </IconButton>
              </Stack>
            </Stack>
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
          {/* Potential Member List */}
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
                <Checkbox />
              </Stack>
            </Box>
          ))}
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
          <Stack
            direction="row"
            spacing={2}
            justifyContent="space-around"
            alignItems="center"
            sx={{ width: "100%", padding: "0 1rem" }}
          >
            <Button className="grey-profile-button" fullWidth onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="contained" fullWidth >
              Add
            </Button>
          </Stack>
        </Box>
      </Stack>
    </Dialog>
  );
};

export default AddMemberBoard;
