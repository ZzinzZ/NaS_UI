"use client"
import { Box, Button, Checkbox, FormControl, FormControlLabel, InputLabel, MenuItem, Select, Stack, TextField, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";
import { addProfileLocation, editProfileLocation } from "@/utils/services/profileService/profileDetails";
import { useSearchParams } from "next/navigation";

const LocationForm = ({ initialData, onSave, onCancel }) => {
  const searchParams = useSearchParams();
  const userId = searchParams.get("id");

  const [locationData, setLocationData] = useState({
    type_location: "",
    city: "",
    status: false,
  });

  useEffect(() => {
    if (initialData) {
      setLocationData({
        type_location: initialData.type_location || "",
        city: initialData.city || "",
        status: initialData.status ?? false,
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setLocationData((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let responseData;

    if (initialData) {
      responseData = await editProfileLocation({
        userId,
        locationId: initialData._id,
        type_location: locationData.type_location,
        city: locationData.city,
        status: locationData.status,
      });
    } else {
      responseData = await addProfileLocation({
        userId,
        type_location: locationData.type_location,
        city: locationData.city,
        status: locationData.status,
      });
    }

    if (responseData) {
      onSave(responseData); 
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column" }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        {initialData ? "Edit Location" : "Add Location"}
      </Typography>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Type of Location</InputLabel>
        <Select
          value={locationData.type_location}
          name="type_location"
          onChange={handleChange}
          label="Type of Location"
          required
        >
          <MenuItem value="hometown">Hometown</MenuItem>
          <MenuItem value="current">Current</MenuItem>
        </Select>
      </FormControl>
      <TextField
        label="City"
        variant="outlined"
        value={locationData.city}
        name="city"
        onChange={handleChange}
        required
        sx={{ mb: 2 }}
      />
      <FormControl component="fieldset" sx={{ mb: 2 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={locationData.status}
              name="status"
              onChange={handleChange}
            />
          }
          label="Visible to public"
        />
      </FormControl>
      <Stack direction="row" spacing={1}>
        <Button variant="contained" type="submit" sx={{ mr: 1 }}>
          Save
        </Button>
        <Button variant="outlined" onClick={onCancel}>
          Cancel
        </Button>
      </Stack>
    </Box>
  );
};

export default LocationForm;
