
import { Box, Stack, Typography } from '@mui/material';
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import React from 'react'

const AboutLocation = () => {
  return (
    <Box>
        <Stack spacing={3}>
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
        </Stack>
    </Box>
  )
}

export default AboutLocation