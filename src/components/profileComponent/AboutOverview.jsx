"use client"
import { Box, IconButton, Stack, Typography } from "@mui/material";
import React, { useEffect, useState, useCallback } from "react";
import PublicIcon from "@mui/icons-material/Public";
import WorkIcon from "@mui/icons-material/Work";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import LockIcon from "@mui/icons-material/Lock";
import PlaceIcon from '@mui/icons-material/Place';
import CreateIcon from "@mui/icons-material/Create";
import SchoolIcon from "@mui/icons-material/School";
import WorkplaceForm from "./WorkplaceForm";
import EducationForm from "./EducationForm";
import RelationshipForm from "./RelationshipForm";
import LocationForm from "./LocationForm";
import ConfirmationDialog from "../generals/ConfirmationDialog";
import {
  deleteProfileEducation,
  deleteProfileExperience,
  deleteProfileLocation,
} from "@/utils/services/profileService/profileDetails";
import { toast } from "react-toastify";
import RelationshipIcon from "./RelationshipIcon";
import { useSelector } from "react-redux";

const initialState = {
  isFormOpen: false,
  editingData: null,
  isEducationFormOpen: false,
  editingEducationData: null,
  isLocationFormOpen: false,
  editingLocationData: null,
  isRelationshipFormOpen: false,
  editingRelationshipData: null,
};

const AboutOverview = ({ profile, isOtherProfile }) => {
  const [state, setState] = useState(initialState);
  const [experienceList, setExperienceList] = useState(
    profile.experience || []
  );
  const [educationList, setEducationList] = useState(profile.education || []);
  const [locationList, setLocationList] = useState(profile.location || []);
  const [relationship, setRelationship] = useState(profile.relationship);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const {user} = useSelector((state) => state.auth);



  const handleDeleteClick = useCallback((data) => {
    setSelectedData(data);
    setOpenConfirmDialog(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!selectedData) return;

    try {
      if (selectedData.type === "experience") {
        await deleteProfileExperience({
          userId: profile.userId,
          experienceId: selectedData.id,
        });
        setExperienceList((prevList) =>
          prevList.filter((item) => item.id !== selectedData.id)
        );
      } else if (selectedData.type === "education") {
        await deleteProfileEducation({
          userId: profile.userId,
          educationId: selectedData.id,
        });
        setEducationList((prevList) =>
          prevList.filter((item) => item._id !== selectedData.id)
        );
      } else if (selectedData.type === "location") {
        await deleteProfileLocation({
          userId: profile.userId,
          locationId: selectedData.id,
        });
        setLocationList((prevList) =>
          prevList.filter((item) => item.id !== selectedData._id)
        );
      }
    } catch (error) {
      toast.error("Failed to delete:", error);
    }

    setOpenConfirmDialog(false);
    setSelectedData(null);
  }, [selectedData]);

  const handleCancelDelete = useCallback(() => {
    setOpenConfirmDialog(false);
  }, []);

  const handleAddClick = useCallback(() => {
    setState((prevState) => ({
      ...prevState,
      editingData: null,
      isFormOpen: true,
    }));
  }, []);

  const handleEditClick = useCallback((data) => {
    setState((prevState) => ({
      ...prevState,
      editingData: data,
      isFormOpen: true,
    }));
  }, []);

  const handleFormSave = useCallback((newData) => {
    setExperienceList(newData);
    setState((prevState) => ({ ...prevState, isFormOpen: false }));
  }, []);

  const handleFormCancel = useCallback(() => {
    setState((prevState) => ({ ...prevState, isFormOpen: false }));
  }, []);

  const handleAddEducationClick = useCallback(() => {
    setState((prevState) => ({
      ...prevState,
      editingEducationData: null,
      isEducationFormOpen: true,
    }));
  }, []);

  const handleEditEducationClick = useCallback((data) => {
    setState((prevState) => ({
      ...prevState,
      editingEducationData: data,
      isEducationFormOpen: true,
    }));
  }, []);

  const handleEducationFormSave = useCallback((data) => {
    setEducationList(data);
    setState((prevState) => ({ ...prevState, isEducationFormOpen: false }));
  }, []);

  const handleEducationFormCancel = useCallback(() => {
    setState((prevState) => ({ ...prevState, isEducationFormOpen: false }));
  }, []);

  const handleAddLocationClick = useCallback(() => {
    setState((prevState) => ({
      ...prevState,
      editingLocationData: null,
      isLocationFormOpen: true,
    }));
  }, []);

  const handleEditLocationClick = useCallback((data) => {
    setState((prevState) => ({
      ...prevState,
      editingLocationData: data,
      isLocationFormOpen: true,
    }));
  }, []);

  const handleLocationFormSave = useCallback((data) => {
    setLocationList(data);
    setState((prevState) => ({ ...prevState, isLocationFormOpen: false }));
  }, []);

  const handleLocationFormCancel = useCallback(() => {
    setState((prevState) => ({ ...prevState, isLocationFormOpen: false }));
  }, []);

  const handleEditRelationshipClick = useCallback((data) => {
    setState((prevState) => ({
      ...prevState,
      editingRelationshipData: data,
      isRelationshipFormOpen: true,
    }));
  }, []);

  const handleRelationshipFormSave = useCallback((data) => {
    setRelationship(data);
    setState((prevState) => ({ ...prevState, isRelationshipFormOpen: false }));
  }, []);

  const handleRelationshipFormCancel = useCallback(() => {
    setState((prevState) => ({ ...prevState, isRelationshipFormOpen: false }));
  }, []);


  return (
    <Box>
      <Stack spacing={3}>
        {
          !isOtherProfile &&
          <Typography sx={{ color: "#707173" }}>
          The information you choose will be Public and displayed at the top of
          your profile.
        </Typography>
        }
        <ConfirmationDialog
          open={openConfirmDialog}
          title="Confirm Deletion"
          content="Are you sure you want to delete this item?"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />

        {/* Workplace */}
        <WorkSection
          experienceList={experienceList}
          handleAddClick={handleAddClick}
          handleEditClick={handleEditClick}
          handleDeleteClick={handleDeleteClick}
          isFormOpen={state.isFormOpen}
          editingData={state.editingData}
          handleFormSave={handleFormSave}
          handleFormCancel={handleFormCancel}
          isOtherProfile={isOtherProfile}
        />

        {/* Education */}
        <EducationSection
          educationList={educationList}
          handleAddEducationClick={handleAddEducationClick}
          handleEditEducationClick={handleEditEducationClick}
          isEducationFormOpen={state.isEducationFormOpen}
          editingEducationData={state.editingEducationData}
          handleEducationFormSave={handleEducationFormSave}
          handleEducationFormCancel={handleEducationFormCancel}
          handleDeleteClick={handleDeleteClick}
          isOtherProfile={isOtherProfile}
        />

        {/* Location */}
        <LocationSection
          locationList={locationList}
          handleAddLocationClick={handleAddLocationClick}
          handleEditLocationClick={handleEditLocationClick}
          isLocationFormOpen={state.isLocationFormOpen}
          editingLocationData={state.editingLocationData}
          handleLocationFormSave={handleLocationFormSave}
          handleLocationFormCancel={handleLocationFormCancel}
          handleDeleteClick={handleDeleteClick}
          isOtherProfile={isOtherProfile}
        />

        {/* Relationship */}
        <RelationshipSection
          relationship={relationship}
          handleEditRelationshipClick={handleEditRelationshipClick}
          isRelationshipFormOpen={state.isRelationshipFormOpen}
          editingRelationshipData={state.editingRelationshipData}
          handleRelationshipFormSave={handleRelationshipFormSave}
          handleRelationshipFormCancel={handleRelationshipFormCancel}
          isOtherProfile={isOtherProfile}
        />
      </Stack>
    </Box>
  );
};

export default AboutOverview;

// Tạo các section nhỏ hơn để code dễ quản lý
const WorkSection = React.memo(
  ({
    experienceList,
    handleAddClick,
    handleEditClick,
    handleDeleteClick,
    isFormOpen,
    editingData,
    handleFormSave,
    handleFormCancel,
    isOtherProfile,
  }) => {
    return (
      <Stack spacing={1}>
        <Typography sx={{ fontSize: "1rem", fontWeight: 600 }}>
          Works
        </Typography>
        {!isFormOpen ? (
          !isOtherProfile && (
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{ cursor: "pointer" }}
              onClick={handleAddClick}
            >
              <ControlPointIcon sx={{ color: "#1976d3" }} />
              <Typography
                sx={{
                  color: "#1976d3",
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                Add Workplace
              </Typography>
            </Stack>
          )
        ) : (
          <Box sx={{ maxWidth: 600, p: 4, mx: "auto", mt: "10%" }}>
            <WorkplaceForm
              initialData={editingData}
              onSave={handleFormSave}
              onCancel={handleFormCancel}
            />
          </Box>
        )}
        <Stack spacing={2}>
          {
            experienceList?.length > 0 ? (
              experienceList?.map((exp, index) =>
                !isOtherProfile ? (
                  <Stack
                    key={index}
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    onClick={() => handleEditClick(exp)}
                    spacing={2}
                  >
                    <Stack direction="row" spacing={2} alignItems="center">
                      <WorkIcon />
                      <Stack>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Typography>Work at </Typography>
                          <Typography sx={{ fontWeight: 600 }}>
                            {exp.company}
                          </Typography>
                        </Stack>
                        <Typography className="note-small-text">
                          position: {exp.position}
                        </Typography>
                      </Stack>
                    </Stack>
                    {!isOtherProfile ? (
                      <Stack direction="row" spacing={1} alignItems="center">
                        {exp.status ? <PublicIcon /> : <LockIcon />}
                        <IconButton onClick={() => handleEditClick(exp)}>
                          <CreateIcon />
                        </IconButton>
                        <IconButton
                          onClick={() =>
                            handleDeleteClick({ id: exp._id, type: "experience" })
                          }
                        >
                          <DeleteForeverIcon />
                        </IconButton>
                      </Stack>
                    ) : exp.status ? (
                      <PublicIcon />
                    ) : null}
                  </Stack>
                ) : (
                  exp.status && (
                    <Stack
                      key={index}
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                      onClick={() => handleEditClick(exp)}
                      spacing={2}
                    >
                      <Stack direction="row" spacing={2} alignItems="center">
                        <WorkIcon />
                        <Stack>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Typography>Work at </Typography>
                            <Typography sx={{ fontWeight: 600 }}>
                              {exp.company}
                            </Typography>
                          </Stack>
                          <Typography className="note-small-text">
                            position: {exp.position}
                          </Typography>
                        </Stack>
                      </Stack>
                      {!isOtherProfile ? (
                        <Stack direction="row" spacing={1} alignItems="center">
                          {exp.status ? <PublicIcon /> : <LockIcon />}
                          <IconButton onClick={() => handleEditClick(exp)}>
                            <CreateIcon />
                          </IconButton>
                          <IconButton
                            onClick={() =>
                              handleDeleteClick({ id: exp._id, type: "experience" })
                            }
                          >
                            <DeleteForeverIcon />
                          </IconButton>
                        </Stack>
                      ) : exp.status ? (
                        <PublicIcon />
                      ) : null}
                    </Stack>
                  )
                )
              )
            ) : <Typography>No information to display</Typography>
          }
        </Stack>
      </Stack>
    );
  }
);

const EducationSection = React.memo(
  ({
    educationList,
    handleAddEducationClick,
    handleEditEducationClick,
    handleDeleteClick,
    isEducationFormOpen,
    editingEducationData,
    handleEducationFormSave,
    handleEducationFormCancel,
    isOtherProfile,
  }) => {
    return (
      <Stack spacing={1}>
        <Typography sx={{ fontSize: "1rem", fontWeight: 600 }}>
          Education
        </Typography>
        {!isEducationFormOpen ? (
          !isOtherProfile && (
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{ cursor: "pointer" }}
              onClick={handleAddEducationClick}
            >
              <ControlPointIcon sx={{ color: "#1976d3" }} />
              <Typography
                sx={{
                  color: "#1976d3",
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                Add Education
              </Typography>
            </Stack>
          )
        ) : (
          <Box sx={{ maxWidth: 600, p: 4, mx: "auto", mt: "10%" }}>
            <EducationForm
              initialData={editingEducationData}
              onSave={handleEducationFormSave}
              onCancel={handleEducationFormCancel}
            />
          </Box>
        )}

        <Stack spacing={2}>
          {
            educationList?.length > 0 ? educationList.map((edu, index) =>
              !isOtherProfile ? (
                <Stack
                  key={index}
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  spacing={2}
                >
                  <Stack direction="row" spacing={2} alignItems="center">
                    <SchoolIcon />
                    <Stack>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography>Studied at </Typography>
                        <Typography sx={{ fontWeight: 600 }}>
                          {edu.school}
                        </Typography>
                      </Stack>
                    
                    </Stack>
                  </Stack>
                  {!isOtherProfile ? (
                    <Stack direction="row" spacing={1} alignItems="center">
                      {edu.status ? <PublicIcon /> : <LockIcon />}
                      <IconButton onClick={() => handleEditEducationClick(edu)}>
                        <CreateIcon />
                      </IconButton>
                      <IconButton
                        onClick={() =>
                          handleDeleteClick({ id: edu._id, type: "education" })
                        }
                      >
                        <DeleteForeverIcon />
                      </IconButton>
                    </Stack>
                  ) : edu.status ? (
                    <PublicIcon />
                  ) : null}
                </Stack>
              ) : (
                edu.status && (
                  <Stack
                    key={index}
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    spacing={2}
                  >
                    <Stack direction="row" spacing={2} alignItems="center">
                      <SchoolIcon />
                      <Stack>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Typography>Studied at </Typography>
                          <Typography sx={{ fontWeight: 600 }}>
                            {edu.school}
                          </Typography>
                        </Stack>
                        <Typography className="note-small-text">
                          Start at {edu.from}
                        </Typography>
                      </Stack>
                    </Stack>
                    {!isOtherProfile ? (
                      <Stack direction="row" spacing={1} alignItems="center">
                        {edu.status ? <PublicIcon /> : <LockIcon />}
                        <IconButton onClick={() => handleEditEducationClick(edu)}>
                          <CreateIcon />
                        </IconButton>
                        <IconButton
                          onClick={() =>
                            handleDeleteClick({ id: edu._id, type: "education" })
                          }
                        >
                          <DeleteForeverIcon />
                        </IconButton>
                      </Stack>
                    ) : edu.status ? (
                      <PublicIcon />
                    ) : null}
                  </Stack>
                )
              )
            ): <Typography>No information to display</Typography>          }
        </Stack>
      </Stack>
    );
  }
);

const LocationSection = React.memo(
  ({
    locationList,
    handleAddLocationClick,
    handleEditLocationClick,
    handleDeleteClick,
    isLocationFormOpen,
    editingLocationData,
    handleLocationFormSave,
    handleLocationFormCancel,
    isOtherProfile,
  }) => {
    return (
      <Stack spacing={1}>
        <Typography sx={{ fontSize: "1rem", fontWeight: 600 }}>
          Location
        </Typography>
        {!isLocationFormOpen ? (
          !isOtherProfile && (
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{ cursor: "pointer" }}
              onClick={handleAddLocationClick}
            >
              <ControlPointIcon sx={{ color: "#1976d3" }} />
              <Typography
                sx={{
                  color: "#1976d3",
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                Add Location
              </Typography>
            </Stack>
          )
        ) : (
          <Box sx={{ maxWidth: 600, p: 4, mx: "auto", mt: "10%" }}>
            <LocationForm
              initialData={editingLocationData}
              onSave={handleLocationFormSave}
              onCancel={handleLocationFormCancel}
            />
          </Box>
        )}

        <Stack spacing={2}>
          {
            locationList?.length > 0 ? locationList.map((loc, index) =>
              !isOtherProfile ? (
                <Stack
                  key={index}
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  spacing={2}
                >
                  <Stack direction="row" spacing={2} alignItems="center">
                    <PlaceIcon />
                    <Stack>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography>Location in </Typography>
                        <Typography sx={{ fontWeight: 600 }}>{loc.city}</Typography>
                      </Stack>
                      <Typography className="note-small-text">
                        {loc.type_location}
                      </Typography>
                    </Stack>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    {
                      loc.status? <PublicIcon /> : <LockIcon />
                    }
                    <IconButton onClick={() => handleEditLocationClick(loc)}>
                      <CreateIcon />
                    </IconButton>
                    <IconButton
                      onClick={() =>
                        handleDeleteClick({ id: loc._id, type: "location" })
                      }
                    >
                      <DeleteForeverIcon />
                    </IconButton>
                  </Stack>
                </Stack>
              ) : (
                loc.status ? (
                  <Stack
                  key={index}
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  spacing={2}
                >
                  <Stack direction="row" spacing={2} alignItems="center">
                    <PublicIcon />
                    <Stack>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography>Location in </Typography>
                        <Typography sx={{ fontWeight: 600 }}>{loc.city}</Typography>
                      </Stack>
                      <Typography className="note-small-text">
                        {loc.type_location}
                      </Typography>
                    </Stack>
                  </Stack>
                  <PublicIcon/>
                </Stack>
                ) : null
              )
            ) : <Typography>No information to display</Typography>
          }
        </Stack>
      </Stack>
    );
  }
);


const RelationshipSection = React.memo(
  ({
    relationship,
    handleEditRelationshipClick,
    isRelationshipFormOpen,
    editingRelationshipData,
    handleRelationshipFormSave,
    handleRelationshipFormCancel,
    isOtherProfile,
  }) => {
    return (
      <Stack spacing={1}>
        <Typography sx={{ fontSize: "1rem", fontWeight: 600 }}>
          Relationship
        </Typography>
        {!isRelationshipFormOpen ? (
          !isOtherProfile ? (
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              spacing={2}
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <RelationshipIcon type_relationship={relationship.type} />
                <Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography>Relationship: </Typography>
                    <Typography sx={{ fontWeight: 600 }}>
                      {relationship.type}
                    </Typography>
                  </Stack>
                </Stack>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                {relationship.status ? <PublicIcon /> : <LockIcon />}
                <IconButton
                  onClick={() => handleEditRelationshipClick(relationship)}
                >
                  <CreateIcon />
                </IconButton>
              </Stack>
            </Stack>
          ) : relationship.status ? (
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              spacing={2}
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <RelationshipIcon type_relationship={relationship.type} />
                <Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography>Relationship: </Typography>
                    <Typography sx={{ fontWeight: 600 }}>
                      {relationship.type}
                    </Typography>
                  </Stack>
                </Stack>
              </Stack>
            </Stack>
          ) : (
            <Typography>This user has hidden relationships</Typography>
          )
        ) : (
          <Box sx={{ maxWidth: 600, p: 4, mx: "auto", mt: "10%" }}>
            <RelationshipForm
              initialData={editingRelationshipData}
              onSave={handleRelationshipFormSave}
              onCancel={handleRelationshipFormCancel}
            />
          </Box>
        )}
      </Stack>
    );
  }
);
