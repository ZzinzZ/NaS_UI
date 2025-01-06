"use client";
import { Avatar, Box, Button, IconButton, Stack, TextField, Typography } from "@mui/material";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import EditProfileForm from "./EditProfileForm";
import IntroductionDetailsInfor from "./IntroductionDetailsInfor";
import React, { useState } from "react";
import moment from "moment"; // Import moment
import { updateUserName } from "@/utils/services/profileService/profileDetails";

const ProfileIntroduce = ({ profile, isOtherProfile, setProfile }) => {
  const [openForm, setOpenForm] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(profile.userName);

  const formattedBirthday = profile.birthday
    ? moment(profile.birthday).format("DD/MM/YYYY")
    : "No birthday available";

  const handleOpenForm = () => {
    setOpenForm(true);
  };
  const handleCloseForm = () => {
    setOpenForm(false);
  };

  const handleEditName = () => {
    setIsEditingName(true);
  };
  const handleSaveName = async () => {
    await updateUserName({userId:profile?.userId, userName: editedName})
    setProfile({ ...profile, userName: editedName });
    setIsEditingName(false);
  };

  const handleCancelEdit = () => {
    setEditedName(profile.userName);
    setIsEditingName(false);
  };
  return (
    <Box
      sx={{
        background: "#fff",
        padding: "1rem",
        marginBottom: "1rem",
        borderRadius: "0.5rem",
        width: "100%",
        boxShadow: "0 1px 2px rgba(0,0,0,0.2)",
      }}
    >
      <EditProfileForm
        open={openForm}
        handleClose={handleCloseForm}
        profile={profile}
      />
      <Stack direction={{md:"row", sm:"row", xs:"column"}}>
        <Stack spacing={1} textAlign="center" alignItems="center" sx={{ marginRight: "1rem" }}>
          <Typography variant="h6">Introduce</Typography>
          <Avatar
            alt={profile.name}
            src={profile?.avatar?.content.media[0].media_url}
            sx={{ width: 150, height: 150, border: "3px solid white" }}
          />
          {isEditingName ? (
            <Stack   spacing={1}>
              <TextField
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                size="small"
              />
              <Stack>
              <Button
                onClick={handleSaveName}
              >
                Save
                <CheckIcon sx={{ color: "green" }} />
              </Button>
              <Button
                onClick={handleCancelEdit}
              >
                Cancel
                <ClearIcon sx={{ color: "red" }} />
              </Button>
              </Stack>
            </Stack>
          ) : (
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography sx={{ fontWeight: "600" }}>{profile.userName}</Typography>
              {!isOtherProfile && (
                <IconButton onClick={handleEditName} size="small">
                  <BorderColorIcon fontSize="small" />
                </IconButton>
              )}
            </Stack>
          )}
          <Typography>Birthday: {formattedBirthday}</Typography>
        </Stack>
        <hr />
        <Stack spacing={2} sx={{ paddingLeft: "1rem" }}>
          {profile?.experience?.length === 0 &&
          profile?.education?.length === 0 &&
          profile?.location === "" &&
          profile?.relationship === "" ? (
            <Stack spacing={2}>
              {!isOtherProfile && (
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  sx={{ cursor: "pointer" }}
                  onClick={handleOpenForm}
                >
                  <BorderColorIcon sx={{ color: "#1976d3" }} />
                  <Typography sx={{ color: "#1976d3" }}>
                    Edit profile
                  </Typography>
                </Stack>
              )}
              <Typography>The user has no introduction to display</Typography>
            </Stack>
          ) : (
            <>
              <IntroductionDetailsInfor
                profile={profile}
                isOtherProfile={isOtherProfile}
              />
            </>
          )}
        </Stack>
      </Stack>
    </Box>
  );
};

export default ProfileIntroduce;
