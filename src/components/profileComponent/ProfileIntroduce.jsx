"use client";
import { Avatar, Box, Stack, Typography } from "@mui/material";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import EditProfileForm from "./EditProfileForm";
import IntroductionDetailsInfor from "./IntroductionDetailsInfor";
import React, { useState } from "react";
import moment from "moment"; // Import moment

const ProfileIntroduce = ({ profile, isOtherProfile }) => {
  const [openForm, setOpenForm] = useState(false);

  const formattedBirthday = profile.birthday
    ? moment(profile.birthday).format("DD/MM/YYYY")
    : "No birthday available";

  const handleOpenForm = () => {
    setOpenForm(true);
  };
  const handleCloseForm = () => {
    setOpenForm(false);
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
          <Typography sx={{ fontWeight: "600" }}>{profile.userName}</Typography>
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
