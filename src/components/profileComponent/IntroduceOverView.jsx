"use client";
import React, { useEffect, useState } from "react";
import { Box, Button, Container, Stack, Typography } from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import CottageIcon from "@mui/icons-material/Cottage";
import PlaceIcon from "@mui/icons-material/Place";
import { useRouter, useSearchParams } from "next/navigation";
import WatchLaterIcon from "@mui/icons-material/WatchLater";
import EditBio from "./EditBioForm";
import { showLoading, hideLoading } from "@/redux/slices/LoadingSlice";
import { useDispatch, useSelector } from "react-redux";
import RelationshipIcon from "./RelationshipIcon";

const IntroduceOverView = ({ user, profile }) => {
  const { profileData } = useSelector((state) => state.profile);
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("id");
  const [isOtherProfile, setIsOtherProfile] = useState(false);
  const [editBio, setEditBio] = useState(false);

  const currentDate = Date.now();
  console.log("profile", profile);

  useEffect(() => {
    if (user && profile) {
      setIsOtherProfile(user?._id !== userId);
    }
  }, [user, profile, userId]);

  const handleCloseEditBio = () => {
    setEditBio(false);
  };
  const handleNavigateTab = () => {
    router.push(`/user/profile?id=${userId}&tab=introduce`);
  };

  return (
    <>
      <Box
        sx={{
          background: "#fff",
          padding: "1rem",
          marginBottom: "1rem",
          borderRadius: "0.5rem",
          boxShadow: "0 1px 2px rgba(0,0,0,0.2)",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Introduce
        </Typography>
        <Stack spacing={2}>
          {!editBio && (
            <Stack spacing={2}>
              <Typography sx={{ textAlign: "center" }}>
                {isOtherProfile ? profile.bio : profileData.bio}
              </Typography>
              {!isOtherProfile && (
                <Button
                  className="grey-profile-button"
                  sx={{ fontWeight: 500, textTransform: "none" }}
                  onClick={() => {
                    setEditBio(true);
                  }}
                >
                  {profile?.bio === undefined || profile?.bio === ""
                    ? "Add bio"
                    : "Edit bio"}
                </Button>
              )}
            </Stack>
          )}
          {editBio && (
            <EditBio
              profile={profile}
              user={user}
              CloseBio={handleCloseEditBio}
            />
          )}
          {profile?.education?.length > 0 && (
            <Stack spacing={2}>
              <Typography sx={{color: "#6f7277"}}>EDUCATION</Typography>
              {profile.education.map((edu, index) => {
                const eduToDate = new Date(edu.to);
                return (
                  <Stack key={index} spacing={2} direction="row">
                    <SchoolIcon />
                    <Typography>
                      {eduToDate.getTime() > currentDate
                        ? "studying"
                        : "studied"}{" "}
                      at {edu?.school}
                    </Typography>
                  </Stack>
                );
              })}
            </Stack>
          )}
          {profile?.experience?.length > 0 && (
            <Stack spacing={2}>
              <Typography sx={{color: "#6f7277"}}>WORK</Typography>
              {profile.experience.map((exp, index) => {
                const expToDate = new Date(exp.to);
                return (
                  <Stack key={index} spacing={2} direction="row">
                    <BusinessCenterIcon />
                    <Typography>
                      {expToDate.getTime() > currentDate ? "Working" : "Worked"}{" "}
                      at {exp?.company}
                    </Typography>
                  </Stack>
                );
              })}
            </Stack>
          )}
          {profile?.location?.length > 0 && (
            <Stack spacing={2}>
              <Typography sx={{color: "#6f7277"}}>LOCATION</Typography>
              {profile.location?.map((loc, index) => {
                return (
                  <Stack key={index} spacing={2} direction="row">
                    {loc.type_location === "current" ? (
                      <PlaceIcon />
                    ) : (
                      <CottageIcon />
                    )}

                    <Typography>
                      {loc.type_location === "current"
                        ? "Living at"
                        : "Born at"}{" "}
                      {loc.city}
                    </Typography>
                  </Stack>
                );
              })}
            </Stack>
          )}
          {isOtherProfile
            ? profile.relationship.status &&
              profile.relationship.type !== "other" && (
                <Stack spacing={2}>
                  <Typography sx={{color: "#6f7277"}}>RELATIONSHIP STATUS:</Typography>
                  <Stack direction="row" spacing={2}>
                    <RelationshipIcon
                      type_relationship={profile.relationship.type}
                    />
                    <Typography>{profile.relationship.type}</Typography>
                  </Stack>
                </Stack>
              )
            : profile.relationship.type !== "other" && (
                <Stack spacing={2}>
                  <Typography sx={{color: "#6f7277"}}>RELATIONSHIP STATUS:</Typography>
                  <Stack direction="row" spacing={2}>
                    <RelationshipIcon
                      type_relationship={profile.relationship.type}
                    />
                    <Typography>{profile.relationship.type}</Typography>
                  </Stack>
                </Stack>
              )}
          {profile && (
            <Stack spacing={2} direction="row">
              <WatchLaterIcon />
              <Typography>
                Join NaS at{" "}
                {new Date(profile?.createdAt).toLocaleDateString("en-CA", {
                  year: "numeric",
                  month: "2-digit",
                })}
              </Typography>
            </Stack>
          )}
          {!isOtherProfile && (
            <Button className="grey-profile-button" onClick={handleNavigateTab}>
              Edit details
            </Button>
          )}
        </Stack>
      </Box>
    </>
  );
};

export default IntroduceOverView;
