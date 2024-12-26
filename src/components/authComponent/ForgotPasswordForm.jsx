"use client";
import React, { useState } from "react";
import {
  Button,
  TextField,
  Stack,
  Typography,
  InputAdornment,
  IconButton,
  Alert,
  Box,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "@/redux/slices/LoadingSlice";
import { toast } from "react-toastify";
import OtpForm from "./OtpForm";
import { sendOtp } from "@/utils/services/authService/otpService";
import { resetPassword } from "@/utils/services/authService/userService";
import { useRouter } from "next/navigation";
import Link from "next/link";

const ForgotPasswordForm = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [showOtpForm, setShowOtpForm] = useState(false);
  const router = useRouter();

  const handleSendOtp = async () => {
    dispatch(showLoading());
    try {
      if (!email) {
        toast.error("Please enter your email");
        return;
      }
      await sendOtp({ email });
      setOtpSent(true);
      setShowOtpForm(true);
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    } finally {
      dispatch(hideLoading());
    }
  };

  const handleResetPassword = async () => {
    dispatch(showLoading());
    try {
      if (!otpVerified) {
        toast.error("Please verify your OTP before resetting your password.");
        return;
      }
      if (password !== confirmPassword) {
        toast.error("Passwords do not match.");
        return;
      }
      await resetPassword({ email, otp, password });
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    } finally {
      dispatch(hideLoading());
      router.push("/login");
    }
  };

  return (
    <Box
      className="auth-background"
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        paddingTop: "2%",
      }}
    >
      <OtpForm
        open={showOtpForm}
        handleClose={() => setShowOtpForm(false)}
        email={email}
        verified={(verifiedOtp) => {
          setOtpVerified(true);
          setOtp(verifiedOtp);
        }}
      />
      <Box className="forgot-password-form">
        <Stack spacing={2} sx={{ width: "100%", maxWidth: 400 }}>
          <Typography sx={{ fontWeight: 600, fontSize: "1.2rem" }}>
            Forgot Password
          </Typography>

          {!otpSent && (
            <TextField
              type="email"
              label="Email"
              variant="outlined"
              placeholder="Input your email address"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MailOutlineIcon />
                  </InputAdornment>
                ),
              }}
            />
          )}

          {otpSent && (
            <>
              <TextField
                type={showPassword ? "text" : "password"}
                label="New Password"
                variant="outlined"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
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
                variant="outlined"
                fullWidth
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </>
          )}

          {!otpSent ? (
            <Button
              onClick={handleSendOtp}
              variant="contained"
              sx={{ background: "#1976D3", color: "#fff" }}
            >
              Send OTP
            </Button>
          ) : (
            <Button
              onClick={handleResetPassword}
              variant="contained"
              sx={{ background: "#1976D3", color: "#fff" }}
            >
              Reset Password
            </Button>
          )}
          <Alert severity="info">
            <Stack direction="row" alignItems="center">
              <Typography>Go to login page? </Typography>
              <Link href="/login"> Login</Link>
            </Stack>
          </Alert>

          {otpSent && !otpVerified && (
            <Alert severity="info">
              Please verify the OTP sent to your email.
            </Alert>
          )}
        </Stack>
      </Box>
    </Box>
  );
};

export default ForgotPasswordForm;
