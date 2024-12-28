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
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import { useRouter } from "next/navigation";
import { hideLoading, showLoading } from "@/redux/slices/LoadingSlice";
import { login } from "@/redux/thunks/authThunk";
import { loginState } from "@/redux/slices/AuthSlice";

const LoginForm = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    dispatch(showLoading()); // Hiển thị loading.

    try {
      const response = await login(formData);
      setFormData({ email: "", password: "" });
      dispatch(loginState(response));

      router.push("/user");
    } catch (error) {
      console.log(error);
    }
    finally {
      dispatch(hideLoading()); 
      
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
        paddingTop: "5%",
      }}
      onSubmit={handleSubmit}
    >
      <Box className="login-form">
        <Grid container>
          <Grid item xs={12} sm={12} md={12}>

            <Stack
              spacing={3}
              sx={{ marginLeft: { md: "2rem", sm: "2rem" }, xs: 0 }}
            >

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
                  <Typography sx={{ fontWeight: 700, fontSize: "1.2rem" }}>
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
                Login
              </Typography>
              <TextField
                type="email"
                label="Email"
                name="email"
                variant="standard"
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
              <TextField
                type={showPassword ? "text" : "password"}
                label="Password"
                name="password"
                variant="standard"
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
              <Typography sx={{ textAlign: "start" }}>
                Forgot your password?{" "}
                <Link href="/forgot-password">Reset password</Link>
              </Typography>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                Log in
              </Button>
              <Alert severity="info">
                <p>
                  Don&#39;t have an account?{" "}
                  <Link href="/register">Sign up now</Link>
                </p>
              </Alert>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default LoginForm;
