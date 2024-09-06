"use client";
import { Box, Button, Stack, Typography } from "@mui/material";
import Link from "next/link";
import React, { useState } from "react";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import CreateIcon from "@mui/icons-material/Create";
import EditProfileForm from "./EditProfileForm";
import { usePathname, useRouter } from "next/navigation";
import IntroductionDetailsInfor from "./IntroductionDetailsInfor";

const ProfileIntroduce = ({ profile, user, isOtherProfile }) => {
  const [openForm, setOpenForm] = useState(false);
  const router = useRouter();
  const path = usePathname();
  const currentDate = new Date();

  const handleOpenForm = () => {
    setOpenForm(true);
  };
  const handleCloseForm = () => {
    setOpenForm(false);
  };

  const handleNavigation = (about) => {
    const url = new URL(window.location.href);
    const searchParams = new URLSearchParams(url.search);
    searchParams.set("about", about);
    const newUrl = `${path}?${searchParams.toString()}`;
    router.push(newUrl);
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
      <Stack direction="row">
        <Stack spacing={1}>
          <Typography>Introduce</Typography>
          <Button sx={{padding: "0.5rem"}} onClick={() => handleNavigation("overview")}>
            <Typography className="link-button left-text-button">Overview</Typography>
          </Button>
          <Button sx={{padding: "0.5rem"}} onClick={() => handleNavigation("work-and-education")}>
            <Typography className="link-button left-text-button">Work and education</Typography>
          </Button>
          <Button sx={{padding: "0.5rem"}} onClick={() => handleNavigation("place-of-residence")}>
            <Typography className="link-button left-text-button">Place of residence</Typography>
          </Button>
          <Button sx={{padding: "0.5rem"}}
            onClick={() => handleNavigation("contact-and-basic-information")}
          >
            <Typography className="link-button left-text-button">Contact and basic information</Typography>
          </Button>
          <Button sx={{padding: "0.5rem"}} onClick={() => handleNavigation("family-and-relationship")}>
            <Typography className="link-button left-text-button">Family and relationship</Typography>
          </Button>
          <Button sx={{padding: "0.5rem"}} onClick={() => handleNavigation("life-event")}>
            <Typography  className="link-button left-text-button">Life event</Typography>
          </Button>
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
              <IntroductionDetailsInfor/>
            </>
          )}
        </Stack>
      </Stack>
    </Box>
  );
};

export default ProfileIntroduce;
