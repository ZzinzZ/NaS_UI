"use client";
import React, { useState, useEffect } from "react";
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
import {
  addProfileEducation,
  editProfileEducation,
} from "@/utils/services/profileService/profileDetails";
import { useSearchParams } from "next/navigation";

const EducationForm = ({ initialData, onSave, onCancel }) => {
  const searchParams = useSearchParams();
  const userId = searchParams.get("id");

  const [educationData, setEducationData] = useState({
    school: "",
    from: "",
    to: "",
    status: true,
  });
  const [isCurrent, setIsCurrent] = useState(true);

  // Đồng bộ dữ liệu ban đầu
  useEffect(() => {
    if (initialData) {
      setEducationData({
        school: initialData.school || "",
        from: initialData.from || "",
        to: initialData.to || "",
        status: initialData.status ?? true,
      });
      setIsCurrent(!initialData.to); // Kiểm tra xem có 'to' hay không để cập nhật trạng thái isCurrent
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEducationData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e) => {
    const checked = e.target.checked;
    setIsCurrent(checked);

    if (checked) {
      setEducationData((prevState) => ({
        ...prevState,
        to: "", // Xóa giá trị 'to' khi checkbox được chọn
      }));
    }
  };

  const handleSubmit = async () => {
    let responseData;

    // Nếu có initialData, gọi API để chỉnh sửa thông tin
    if (initialData) {
      responseData = await editProfileEducation({
        userId,
        educationId: initialData._id,
        school: educationData.school,
        from: educationData.from,
        to: isCurrent ? null : educationData.to,
        status: educationData.status,
      });
    } else {
      // Thêm thông tin mới
      if (!isCurrent) {
        responseData = await addProfileEducation({
          userId,
          school: educationData.school,
          from: educationData.from,
          to: educationData.to,
          status: educationData.status,
        });
      } else {
        responseData = await addProfileEducation({
          userId,
          school: educationData.school,
          from: educationData.from,
          status: educationData.status,
        });
      }
    }

    if (responseData) {
      onSave(responseData); // Trả về dữ liệu sau khi hoàn tất
    }
  };

  return (
    <Box>
      <TextField
        label="School"
        name="school"
        value={educationData.school}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      />
      <FormControlLabel
        control={
          <Checkbox checked={isCurrent} onChange={handleCheckboxChange} />
        }
        label="Currently Studying"
      />
      <Stack direction="row" spacing={2}>
        <TextField
          label="From (year)"
          name="from"
          value={educationData.from}
          onChange={handleChange}
          fullWidth
          margin="normal"
          type="number"
          required
        />
        {!isCurrent && (
          <TextField
            label="To (year)"
            name="to"
            value={educationData.to}
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
              value={educationData.status}
              onChange={(e) =>
                setEducationData((prevState) => ({
                  ...prevState,
                  status: e.target.value,
                }))
              }
              MenuProps={{
                disableScrollLock: true,
              }}
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

export default EducationForm;
