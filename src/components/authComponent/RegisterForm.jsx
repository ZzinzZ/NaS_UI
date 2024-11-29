"use client";
import React, { useEffect, useState } from "react";
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
  Stepper,
  Step,
  StepLabel,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import Link from "next/link";
import OtpForm from "./OtpForm";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "@/redux/thunks/authThunk";
import { showLoading, hideLoading } from "@/redux/slices/LoadingSlice";
import { toast } from "react-toastify";
import checkMail from "@/utils/middlewares/checkMailValid";
import { sendOtp } from "@/utils/services/authService/otpService";
import { DatePicker } from "@mui/x-date-pickers";
import MaleIcon from "@mui/icons-material/Male";
import FemaleIcon from "@mui/icons-material/Female";
import Image from "next/image";

const steps = ["Email & password", "Basic information", "Finish!"];

const RegisterForm = () => {
  const dispatch = useDispatch();
  const [activeStep, setActiveStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [otpVerified, setOtpVerified] = useState("");
  const [email, setEmail] = useState("");
  const [isAbleNext, setIsAbleNext] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    birthday: null,
    gender: "",
  });


  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword((show) => !show);

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
      if (
        isMailValid.email_status === "INVALID" ||
        isMailValid.status === "error"
      ) {
        toast.error("Invalid email");
        return;
      }
      await sendOtp({ email: formData.email });
      setEmail(formData.email);
      setShowOTP(true);
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    } finally {
      dispatch(hideLoading());
    }
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
    toast.success("Registration")

    const formattedBirthday = formData.birthday
      ? formData.birthday.toDate()
      : null;

    const { confirmPassword, ...registerData } = formData;
    registerData.birthday = formattedBirthday;
    dispatch(showLoading());

    dispatch(registerUser({ ...registerData, otp: otpVerified }))
      .unwrap()
      .then(() => {
        setFormData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
          birthday: null,
          gender: "",
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
  useEffect(() => {
    if (activeStep === 0) {
      setIsAbleNext(
        formData.email &&
          formData.password &&
          formData.confirmPassword &&
          isVerified
      );
    } else if (activeStep === 1) {
      setIsAbleNext(formData.name && formData.birthday && formData.gender);
    }
  }, [formData, isVerified, activeStep]);

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Stack spacing={2}>
            <Stack direction="row" spacing={1} alignItems="center">
              <TextField
                type="email"
                label="Email"
                name="email"
                variant="outlined"
                fullWidth
                value={formData.email}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MailOutlineIcon />
                    </InputAdornment>
                  ),
                }}
              />
              {!isVerified && (
                <Button
                  onClick={handleVerification}
                  variant="contained"
                  sx={{ background: "#1976D3", color: "#fff" }}
                >
                  Verify email
                </Button>
              )}
            </Stack>
            <TextField
              type={showPassword ? "text" : "password"}
              label="Password"
              name="password"
              variant="outlined"
              fullWidth
              value={formData.password}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <VpnKeyIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
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
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <VpnKeyIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle confirm password visibility"
                      onClick={handleClickShowConfirmPassword}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Stack>
        );
      case 1:
        return (
          <Stack spacing={2}>
            <TextField
              type="text"
              label="Name"
              name="name"
              variant="outlined"
              fullWidth
              value={formData.name}
              onChange={handleChange}
            />
            <DatePicker
              label="Birthday"
              name="birthday"
              value={formData.birthday}
              onChange={(date) => setFormData({ ...formData, birthday: date })}
            />
            <FormControl>
              <InputLabel>Gender</InputLabel>
              <Select label="Gender" name="gender" onChange={handleChange}>
                <MenuItem value="male">
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography>Male</Typography>
                    <MaleIcon sx={{ color: "#03a4f2" }} />
                  </Stack>
                </MenuItem>
                <MenuItem value="female">
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography>Female</Typography>
                    <FemaleIcon sx={{ color: "pink" }} />
                  </Stack>
                </MenuItem>
                <MenuItem value="other">
                  <Typography>Other</Typography>
                </MenuItem>
              </Select>
            </FormControl>
          </Stack>
        );
      case 2:
        return (
          <>
            <Stack justifyContent="center" alignItems="center" >
              <Image
                src="/congratulation.gif"
                alt="Animated Image"
                width={180}
                height={150}
              />
              <Stack direction="row" alignItems="center" spacing={1}>
              <Typography
                sx={{
                  fontSize: "1rem",
                  fontWeight: 600,
                  textTransform: "uppercase",
                }}
              >
                You are now a member of 
              </Typography>
              <Stack direction="row" alignItems="center">
                  <Typography
                    sx={{
                      color: "#1976D3",
                      fontWeight: 700,
                      fontSize: "1rem",
                    }}
                  >
                    N
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 700,
                      fontSize: "1rem",
                    }}
                  >
                    A
                  </Typography>
                </Stack>
                <Typography sx={{ fontWeight: 600, fontSize: "1rem" }}>
                  SOCIAL
                </Typography>
              </Stack>
            </Stack>
          </>
        );
      default:
        return null;
    }
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
      <OtpForm
        open={showOTP}
        handleClose={() => setShowOTP(false)}
        email={email}
        verified={handleOtpVerified}
      />
      <FormControl className="register-form">
        <Grid container justifyContent="center" className="register-form">
          <Grid item xs={12} sm={12} md={12}>
            <Stack spacing={2} sx={{ marginLeft: "2rem" }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography sx={{ fontWeight: 600, fontSize: "1.2rem" }}>
                  Welcome to{" "}
                </Typography>
                <Stack direction="row" alignItems="center">
                  <Typography
                    sx={{
                      color: "#1976D3",
                      fontWeight: 700,
                      fontSize: "1.2rem",
                    }}
                  >
                    N
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 700,
                      fontSize: "1.2rem",
                    }}
                  >
                    A
                  </Typography>
                </Stack>
                <Typography sx={{ fontWeight: 600, fontSize: "1.2rem" }}>
                  Social
                </Typography>
              </Stack>
              <Typography
                variant="h4"
                component="h2"
                sx={{ color: "black", textAlign: "left", fontWeight: "600" }}
              >
                Register
              </Typography>
              <Stepper activeStep={activeStep}>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
              {renderStepContent(activeStep)}

              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                {activeStep < steps.length - 1 && 
                <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mt: 2 }}
              >
                Back
              </Button>
                }
                {activeStep < steps.length - 1 ? (
                  <Button
                    onClick={handleNext}
                    sx={{ mt: 2 }}
                    disabled={!isAbleNext}
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    type="submit"
                    color="primary"
                    fullWidth
                    sx={{ mt: 2 }}
                  >
                    <Link href="/login" style={{color: "#fff" , textDecoration:"none", width:"100%"}}>Login now</Link>
                  </Button>
                )}
              </Box>
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
