"use client"
import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Checkbox,
  FormControlLabel,
  Stack,
  Select,
  MenuItem,
  Typography,
  FormControl,
} from "@mui/material";
import PublicIcon from "@mui/icons-material/Public";
import LockIcon from "@mui/icons-material/Lock";
import { addProfileExperience, editProfileExperience } from "@/utils/services/profileService/profileDetails";
import { useSearchParams } from "next/navigation";

const WorkplaceForm = ({ initialData, onSave, onCancel }) => {
  const searchParams = useSearchParams();
  const userId = searchParams.get("id");

  const [workplaceData, setWorkplaceData] = useState(
    initialData || {
      company: "",
      position: "",
      from: null,
      to: null,
      status: true,
    }
  );
  const [isCurrent, setIsCurrent] = useState(initialData?.to ? false : true);

  const handleChange = (e) => {
    setWorkplaceData({
      ...workplaceData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCheckboxChange = (e) => {
    setIsCurrent(e.target.checked);
  };

  const handleSubmit = async () => {
    let responseData;
    if (initialData) {
      responseData = await editProfileExperience({
        userId,
        experienceId: initialData._id,
        company: workplaceData.company,
        position: workplaceData.position,
        status: workplaceData.status,
        start: workplaceData.from,
        end: isCurrent ? null : workplaceData.to,
      });
    } else {
      if (!isCurrent) {
        responseData = await addProfileExperience({
          userId,
          company: workplaceData.company,
          position: workplaceData.position,
          status: workplaceData.status,
          start: workplaceData.from,
          end: workplaceData.to,
        });
      } else {
        responseData = await addProfileExperience({
          userId,
          company: workplaceData.company,
          position: workplaceData.position,
          status: workplaceData.status,
          start: workplaceData.from,
        });
      }
    }
    if (responseData) {
      onSave(responseData); 
    }
  };

  return (
    <Box>
      <TextField
        label="Company"
        name="company"
        value={workplaceData?.company}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Position"
        name="position"
        value={workplaceData?.position}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <FormControlLabel
        control={
          <Checkbox checked={isCurrent} onChange={handleCheckboxChange} />
        }
        label="I currently work here"
      />
      <Stack direction="row" spacing={2}>
        <TextField
          label="From (year)"
          name="from"
          value={workplaceData.from}
          onChange={handleChange}
          fullWidth
          margin="normal"
          type="number"
        />
        {!isCurrent && (
          <TextField
            label="To (year)"
            name="to"
            value={workplaceData.to}
            onChange={handleChange}
            fullWidth
            margin="normal"
            type="number"
          />
        )}
      </Stack>
      <Box mt={2}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <FormControl sx={{ minWidth: 120 }}>
            <Select
              labelId="status-label"
              value={workplaceData.status}
              onChange={(e) =>
                setWorkplaceData({ ...workplaceData, status: e.target.value })
              }
            >
              <MenuItem value={true}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <PublicIcon />
                  <Typography>Public</Typography>
                </Stack>
              </MenuItem>
              <MenuItem value={false}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <LockIcon />
                  <Typography>Private</Typography>
                </Stack>
              </MenuItem>
            </Select>
          </FormControl>

          <Stack direction="row" spacing={2} alignItems="center">
            <Button variant="contained" onClick={handleSubmit}>
              Save
            </Button>
            <Button variant="outlined" onClick={onCancel} sx={{ ml: 2 }}>
              Cancel
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
};

export default WorkplaceForm;
