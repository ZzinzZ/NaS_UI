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
import { login } from "@/redux/thunks/authThunk"; // Import your thunk action
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const LoginForm = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { isLoading, error, success } = useSelector((state) => state.auth);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(login(formData)).unwrap();
      router.push("/user"); // Redirect to home on success
      toast.info("Login successful!");
    } catch (err) {
      toast.error(`Login failed: ${err.message}`);
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
        <Grid container justifyContent="center">
          <Grid item xs={12} sm={12} md={12}>
            <Stack spacing={3} sx={{ color: "#fff" }}>
              <Typography variant="h4" component="h2">
                Login
              </Typography>
              <TextField
                type="email"
                label="Email"
                name="email"
                variant="outlined"
                fullWidth
                value={formData.email}
                onChange={handleChange}
                sx={{
                  "& .MuiInputBase-root": { color: "#fff" },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#fff" },
                    "&:hover fieldset": { borderColor: "#fff" },
                    "&.Mui-focused fieldset": { borderColor: "#fff" },
                  },
                  "& .MuiInputLabel-root": { color: "#fff" },
                  "& .MuiInputLabel-root.Mui-focused": { color: "#fff" },
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
                  "& .MuiInputBase-root": { color: "#fff" },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#fff" },
                    "&:hover fieldset": { borderColor: "#fff" },
                    "&.Mui-focused fieldset": { borderColor: "#fff" },
                  },
                  "& .MuiInputLabel-root": { color: "#fff" },
                  "& .MuiInputLabel-root.Mui-focused": { color: "#fff" },
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
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>
              {error && <Alert severity="error">{error}</Alert>}
              {success && <Alert severity="success">Login successful!</Alert>}
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
