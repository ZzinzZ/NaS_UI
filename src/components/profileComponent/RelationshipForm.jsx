import { Box, Button, Checkbox, FormControl, FormControlLabel, InputLabel, MenuItem, Select, Stack, TextField, Typography } from "@mui/material";
import React, { useState } from "react";

const RelationshipForm = ({ initialData, onSave, onCancel }) => {
  const [type, setType] = useState(initialData?.type || "");
  const [status, setStatus] = useState(initialData?.status || false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ type, status });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        {initialData ? "Edit Relationship" : "Add Relationship"}
      </Typography>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Type of Relationship</InputLabel>
        <Select
          value={type}
          onChange={(e) => setType(e.target.value)}
          label="Type of Relationship"
          required
        >
          <MenuItem value="single">Single</MenuItem>
          <MenuItem value="married">Married</MenuItem>
          <MenuItem value="dating">Dating</MenuItem>
          <MenuItem value="other">Other</MenuItem>
        </Select>
      </FormControl>
      <FormControl component="fieldset" sx={{ mb: 2 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={status}
              onChange={(e) => setStatus(e.target.checked)}
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

export default RelationshipForm;
