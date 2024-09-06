import { Box, IconButton, Stack, Typography } from "@mui/material";
import PublicIcon from "@mui/icons-material/Public";
import LockIcon from "@mui/icons-material/Lock";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import CreateIcon from "@mui/icons-material/Create";
import SchoolIcon from "@mui/icons-material/School";
import React from "react";

const AboutWorkAndEducation = () => {
  return (
    <Box>
      <Stack spacing={3} >
      <Typography sx={{ color: "#707173" }}>
          The information you choose will be Public and displayed at the top of
          your profile.
        </Typography>
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
              <Stack direction="row" spacing={2} alignItems="center">
                <SchoolIcon />
                <Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography>Studying at </Typography>{" "}
                    <Typography sx={{ fontWeight: 600 }}>HCMUE</Typography>
                  </Stack>
                  <Typography className="note-small-text">
                    Start at 2021
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <PublicIcon />
              <IconButton sx={{ background: "#dedfe4" }}>
                <CreateIcon />
              </IconButton>
            </Stack>
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
      </Stack>
    </Box>
  );
};

export default AboutWorkAndEducation;
