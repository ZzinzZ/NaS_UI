"use client"
import {
  Box,
  Button,
  Dialog,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import ShortTextIcon from "@mui/icons-material/ShortText";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import CreateIcon from "@mui/icons-material/Create";
import React from "react";
import AntSwitch from "../generals/AntSwitch";


const EditProfileForm = ({ open, handleClose, profile }) => {
  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: "60vw",
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
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              sx={{ width: "100%" }}
            >
              <ShortTextIcon />
              <Typography sx={{ fontWeight: 600 }}>
                Edit profile details
              </Typography>
              <IconButton onClick={handleClose}>x</IconButton>
            </Stack>
          </Box>

          <Box
            sx={{
              flexGrow: 1,
              overflowY: "auto",
              padding: "1rem",
              backgroundColor: "#fff",
              paddingTop: "1rem",
              "&::-webkit-scrollbar": {
                width: "0.4rem",
              },
              "&:hover::-webkit-scrollbar": {
                display: "block",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#bfc0c5",
                borderRadius: "1rem",
              },
            }}
          >
            <Stack spacing={3}>
              <Typography sx={{ color: "#707173" }}>
                The information you choose will be Public and displayed at the
                top of your profile.
              </Typography>
              {/* Workplace */}
              <Stack spacing={1}>
                <Typography sx={{ fontSize: "1rem", fontWeight: 600 }}>
                  Works
                </Typography>
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  sx={{ cursor: "pointer" }}
                >
                  <ControlPointIcon sx={{ color: "#1976d3" }} />
                  <Typography
                    sx={{
                      color: "#1976d3",
                      "&:hover": {
                        textDecoration: "underline",
                      },
                    }}
                  >
                    Add Workplace
                  </Typography>
                </Stack>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <AntSwitch
                      defaultChecked
                      inputProps={{ "aria-label": "ant design" }}
                    />
                    <Typography>Student at HCMUE </Typography>
                  </Stack>
                  <IconButton>
                    <CreateIcon />
                  </IconButton>
                </Stack>
              </Stack>
              {/* Education */}
              <Stack spacing={1}>
                <Typography sx={{ fontSize: "1rem", fontWeight: 600 }}>
                  Education
                </Typography>
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  sx={{ cursor: "pointer" }}
                >
                  <ControlPointIcon sx={{ color: "#1976d3" }} />
                  <Typography
                    sx={{
                      color: "#1976d3",
                      "&:hover": {
                        textDecoration: "underline",
                      },
                    }}
                  >
                    Add Education
                  </Typography>
                </Stack>
              </Stack>
              {/*Location*/}
              <Stack spacing={1}>
                <Typography sx={{ fontSize: "1rem", fontWeight: 600 }}>
                  Location
                </Typography>
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  sx={{ cursor: "pointer" }}
                >
                  <ControlPointIcon sx={{ color: "#1976d3" }} />
                  <Typography
                    sx={{
                      color: "#1976d3",
                      "&:hover": {
                        textDecoration: "underline",
                      },
                    }}
                  >
                    Add Location
                  </Typography>
                </Stack>
              </Stack>
              {/*Relationship*/}
              <Stack spacing={1}>
                <Typography sx={{ fontSize: "1rem", fontWeight: 600 }}>
                  Relationship
                </Typography>
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  sx={{ cursor: "pointer" }}
                >
                  <ControlPointIcon sx={{ color: "#1976d3" }} />
                  <Typography
                    sx={{
                      color: "#1976d3",
                      "&:hover": {
                        textDecoration: "underline",
                      },
                    }}
                  >
                    Add Relationship
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
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
            <Stack direction="row" spacing={2} justifyContent="end">
              <Button onClick={handleClose} className="grey-profile-button">
                Cancel
              </Button>
              <Button variant="contained" color="primary">
                Save
              </Button>
            </Stack>
          </Box>
        </Stack>
      </Dialog>
    </div>
  );
};

export default EditProfileForm;
