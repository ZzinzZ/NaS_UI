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
  Stepper,
  Step,
  StepLabel,
  FormControl,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import Link from "next/link";
import OtpForm from "./OtpForm";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "@/redux/thunks/authThunk";
import { showLoading, hideLoading } from "@/redux/slices/LoadingSlice";
import { toast } from "react-toastify";
import checkMail from "@/utils/middlewares/checkMailValid";
import { sendOtp } from "@/utils/services/authService/otpService";

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

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const { isLoading } = useSelector((state) => state.register);

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
    handleNext();
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
    const { confirmPassword, ...registerData } = formData;
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

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Stack spacing={2}>
            <TextField
            type="email"
            label="Email"
            name="email"
            variant="outlined"
            fullWidth
            value={formData.email}
            onChange={handleChange}
          />
          <TextField
              type={showPassword ? "text" : "password"}
              label="Password"
              name="password"
              variant="outlined"
              fullWidth
              value={formData.password}
              onChange={handleChange}
              InputProps={{
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
          <TextField
            type="text"
            label="Name"
            name="name"
            variant="outlined"
            fullWidth
            value={formData.name}
            onChange={handleChange}
          />
        );
      case 2:
        return (
          <>
            
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
                <Typography sx={{ fontWeight: 600, fontSize: "1.2rem"}}>Welcome to </Typography>
                <Stack direction="row" alignItems="center">
                  <Typography sx={{ color: "#1976D3", fontWeight: 700, fontSize: "1.2rem"}}>N</Typography>
                  <Typography sx={{ color: "#1976D3", fontWeight: 700, fontSize: "1.2rem"}}>A</Typography>
                </Stack>
                <Typography sx={{ fontWeight: 600, fontSize: "1.2rem"}}>Social</Typography>
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
                <Button
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  sx={{ mt: 2 }}
                >
                  Back
                </Button>
                {activeStep < steps.length - 1 ? (
                  <Button onClick={handleNext} sx={{ mt: 2 }}>
                    Next
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 2 }}
                    disabled={isLoading}
                  >
                    {isLoading ? "Registering..." : "Register"}
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
