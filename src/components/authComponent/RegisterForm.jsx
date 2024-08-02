"use client";
import React, { useState } from "react";
import {
  Button,
  TextField,
  Grid,
  Box,
  Stack,
  Typography,
  Alert,
  IconButton,
  InputAdornment,
  FormControl,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import Link from "next/link";
import OtpForm from "./OtpForm";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "@/redux/thunks/authThunk";
import { showLoading, hideLoading } from "@/redux/slices/LoadingSlice";
import { baseUrl, postRequest } from "@/utils/services/requestService";
import { toast } from "react-toastify";
import checkMail from "@/utils/middlewares/checkMailValid";

const RegisterForm = () => {
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [otpVerified, setOtpVerified] = useState("");
  const [email, setEmail] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const { isLoading, success, error } = useSelector((state) => state.register);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowConfirmPassword = () => setShowConfirmPassword((show) => !show);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleVerification = async () => {
    dispatch(showLoading());
    try {
      if (!formData.email) {
        toast.error("Please enter your email");
        return;
      }
      const isMailValid = await checkMail(formData.email);
      if (isMailValid.email_status === "INVALID" || isMailValid.status === "error") {
        toast.error("Invalid email");
        return;
      }
      await postRequest(`${baseUrl}/users/sendOtp`, { email: formData.email });
      toast.info("OTP sent successfully");
      setEmail(formData.email);
      setShowOTP(true);
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    } finally {
      dispatch(hideLoading());
    }
  };

  const handleCloseOTP = () => {
    setShowOTP(false);
  };

  const handleOtpVerified = (otp) => {
    setOtpVerified(otp);
    setIsVerified(true);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isVerified) {
      toast.error("Please verify your email before registering.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    const { confirmPassword, ...registerData } = formData; // Loại bỏ confirmPassword
    console.log({ ...registerData, otp: otpVerified });
    dispatch(showLoading());
    dispatch(registerUser({ ...registerData, otp: otpVerified }))
      .unwrap()
      .then(() => {
        toast.info("Registration successful");
        setFormData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
        setIsVerified(false);
        setOtpVerified("");
      })
      .catch((error) => {
        toast.error(`Error occurred during registration: ${error.message}`);
      })
      .finally(() => {
        dispatch(hideLoading());
      });
  };

  return (
    <Box
      component="form"
      className="auth-background"
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        paddingTop: "2%",
      }}
      onSubmit={handleSubmit}
    >
      <OtpForm open={showOTP} handleClose={handleCloseOTP} email={email} verified={handleOtpVerified} />
      <FormControl className="register-form">
        <Grid container justifyContent="center">
          <Grid item xs={12} sm={12} md={12}>
            <Stack spacing={2}>
              <Typography variant="h4" component="h2">
                Register
              </Typography>
              <TextField
                type="text"
                label="Name"
                name="name"
                variant="outlined"
                fullWidth
                value={formData.name}
                onChange={handleChange}
                sx={{
                  "& .MuiInputBase-root": {
                    color: "#fff",
                  },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#fff",
                    },
                    "&:hover fieldset": {
                      borderColor: "#fff",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#fff",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: "#fff",
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#fff",
                  },
                }}
              />
              <TextField
                type="email"
                label="Email"
                name="email"
                variant="outlined"
                fullWidth
                value={formData.email}
                onChange={handleChange}
                sx={{
                  "& .MuiInputBase-root": {
                    color: "#fff",
                  },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#fff",
                    },
                    "&:hover fieldset": {
                      borderColor: "#fff",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#fff",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: "#fff",
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#fff",
                  },
                }}
              />
              <TextField
                type={showPassword ? "text" : "password"}
                label="Password"
                name="password"
                variant="outlined"
                fullWidth
                value={formData.password}
                onChange={handleChange}
                sx={{
                  "& .MuiInputBase-root": {
                    color: "#fff",
                  },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#fff",
                    },
                    "&:hover fieldset": {
                      borderColor: "#fff",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#fff",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: "#fff",
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#fff",
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        edge="end"
                      >
                        {showPassword ? (
                          <VisibilityOff sx={{ color: "#fff" }} />
                        ) : (
                          <Visibility sx={{ color: "#fff" }} />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                type={showConfirmPassword ? "text" : "password"}
                label="Confirm Password"
                name="confirmPassword"
                variant="outlined"
                fullWidth
                value={formData.confirmPassword}
                onChange={handleChange}
                sx={{
                  "& .MuiInputBase-root": {
                    color: "#fff",
                  },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#fff",
                    },
                    "&:hover fieldset": {
                      borderColor: "#fff",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#fff",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: "#fff",
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#fff",
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle confirm password visibility"
                        onClick={handleClickShowConfirmPassword}
                        edge="end"
                      >
                        {showConfirmPassword ? (
                          <VisibilityOff sx={{ color: "#fff" }} />
                        ) : (
                          <Visibility sx={{ color: "#fff" }} />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              {isVerified ? (
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={isLoading}
                >
                  Register
                </Button>
              ) : (
                <Button
                  onClick={handleVerification}
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={isLoading}
                >
                  Verify Email
                </Button>
              )}
              <Alert severity="info">
                Already have an account? <Link href="/login">Login</Link>
              </Alert>
            </Stack>
          </Grid>
        </Grid>
      </FormControl>
    </Box>
  );
};

export default RegisterForm;
