"use client";
import React, { useState, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import FeedIcon from "@mui/icons-material/Feed";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import MessageIcon from '@mui/icons-material/Message';
import GroupIcon from '@mui/icons-material/Group';
import {
  Stack,
  Badge,
  Button,
  Popover,
  Typography,
  Menu,
  MenuItem,
  IconButton,
  Avatar,
  Divider,
} from "@mui/material";
import Link from "next/link";
import Image from "next/image";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import LogoutIcon from "@mui/icons-material/Logout";
import { logout } from "@/redux/slices/AuthSlice";
import { getProfile } from "@/redux/thunks/profileThunk";
import { USER_AVATAR_ORIGINAL } from "@/config/profileConfig";
import { usePathname } from "next/navigation";

const NavBar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [popoverId, setPopoverId] = useState(null);
  const [userMenuAnchorEl, setUserMenuAnchorEl] = useState(null);
  const path = usePathname();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { profileData } = useSelector((state) => state.profile);

  const handlePopoverOpen = (event, id) => {
    setAnchorEl(event.currentTarget);
    setPopoverId(id);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
    setPopoverId(null);
  };

  const handleUserMenuOpen = (event) => {
    setUserMenuAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    handleUserMenuClose();
  };

  const open = Boolean(anchorEl);
  const userMenuOpen = Boolean(userMenuAnchorEl);

  useEffect(() => {
    if (!user) {
      Cookies.remove("token");
    } else if (user?._id) {
      dispatch(getProfile(user._id));
    }
  }, [user]);

  return (
    <AppBar
      className=""
      position="fixed"
      sx={{
        width: { xs: "100%", sm: "100%", md: "4.5rem" },
        height: { xs: "3rem", sm: "3rem", md: "100vh" },
        bottom: { xs: 0, sm: "0", md: "auto" },
        top: { xs: "auto", sm: "auto" },
        left: 0,
        right: 0,
        zIndex: 3,
        background: {
          xs: "rgba(255, 255, 255, 0.2)",
          sm: "rgba(255, 255, 255, 0.2)",
          md: "#1976d3",
        },
        display: { xs: "flex", sm: "block" },
        alignItems: "center",
        backdropFilter: "blur(10px)",
      }}
    >
      <Stack
        direction={{ xs: "row", sm: "row", md: "column" }}
        alignItems="center"
        sx={{ height: "100%" }}
        justifyContent={{ xs: "center", sm: "center" }}
      >
        <Stack
          sx={{
            display: { xs: "none", sm: "none", md: "block" },
            margin: "1rem 0 2rem 0",
          }}
        >
          <Link
            href="/user"
            style={{
              color: "inherit",
              textDecoration: "none",
            }}
          >
            <Image
              src="/NA_logo.jpg"
              alt="NaSocial"
              className="App-logo"
              width={30}
              height={30}
            />
          </Link>
        </Stack>
        <Stack
          justifyContent="space-between"
          alignItems="center"
          sx={{ height: "100%" }}
          direction={{ xs: "row", sm: "row", md: "column" }}
        >
          <Stack
            spacing={2}
            alignItems="center"
            direction={{ xs: "row", sm: "row", md: "column" }}
          >
            <Button
              className="nav-page-button"
              aria-owns={
                open && popoverId === "home"
                  ? "mouse-over-popover-home"
                  : undefined
              }
              onMouseEnter={(e) => handlePopoverOpen(e, "home")}
              onMouseLeave={handlePopoverClose}
              sx={{
                background: {
                  xs:
                    path === "/user" ? "rgba(255,255,255,0.8)" : "transparent",
                  sm:
                    path === "/user" ? "rgba(255,255,255,0.8)" : "transparent",
                  md:
                    path === "/user" ? "rgba(255,255,255,0.8)" : "transparent",
                },
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.7) !important",
                },
              }}
            >
              <Link
                href="/user"
                style={{ color: "inherit", textDecoration: "none" }}
              >
                <MessageIcon
                  sx={{
                    color: {
                      xs: path === "/user" ? "#1976d3" : "black",
                      sm: path === "/user" ? "#1976d3" : "black",
                      md: path === "/user" ? "#0074ec" : "#fff",
                    }, // Màu đen cho màn hình nhỏ và màu khác cho lớn hơn
                    fontSize: 30,
                  }}
                />
              </Link>
            </Button>
            <Popover
              id="mouse-over-popover-home"
              sx={{ pointerEvents: "none", marginTop: "0.3rem" }}
              open={open && popoverId === "home"}
              anchorEl={anchorEl}
              anchorOrigin={{ vertical: "right", horizontal: "right" }}
              transformOrigin={{ vertical: "left", horizontal: "left" }}
              onClose={handlePopoverClose}
              disableRestoreFocus
              disableScrollLock={true}
            >
              <Typography sx={{ p: 1, background: "#474645", color: "#fff" }}>
                Home
              </Typography>
            </Popover>

            <Button
              className="nav-page-button"
              aria-owns={
                open && popoverId === "friends"
                  ? "mouse-over-popover-friends"
                  : undefined
              }
              onMouseEnter={(e) => handlePopoverOpen(e, "friends")}
              onMouseLeave={handlePopoverClose}
              sx={{
                background: {
                  xs: path.includes("/friends")
                    ? "rgba(255,255,255,0.8)"
                    : "transparent",
                  sm: path.includes("/friends")
                    ? "rgba(255,255,255,0.8)"
                    : "transparent",
                  md: path.includes("/friends")
                    ? "rgba(255,255,255,0.8)"
                    : "transparent",
                },
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.7) !important",
                },
              }}
            >
              <Link
                href="/user/friends"
                style={{ color: "inherit", textDecoration: "none" }}
              >
                <GroupIcon
                  sx={{
                    color: {
                      xs: path.includes("/friends") ? "#1976d3" : "black",
                      sm: path.includes("/friends") ? "#1976d3" : "black",
                      md: path.includes("/friends") ? "#0074ec" : "#fff",
                    },
                    fontSize: 30,
                  }}
                />
              </Link>
            </Button>
            <Popover
              id="mouse-over-popover-friends"
              sx={{ pointerEvents: "none", marginTop: "0.3rem" }}
              open={open && popoverId === "friends"}
              anchorEl={anchorEl}
              anchorOrigin={{ vertical: "right", horizontal: "right" }}
              transformOrigin={{ vertical: "left", horizontal: "left" }}
              onClose={handlePopoverClose}
              disableRestoreFocus
              disableScrollLock={true}
            >
              <Typography sx={{ p: 1, background: "#474645", color: "#fff" }}>
                Friends
              </Typography>
            </Popover>

            <Button
              className="nav-page-button"
              aria-owns={
                open && popoverId === "chat"
                  ? "mouse-over-popover-chat"
                  : undefined
              }
              onMouseEnter={(e) => handlePopoverOpen(e, "chat")}
              onMouseLeave={handlePopoverClose}
              sx={{
                background: {
                  xs: path.includes("/posts")
                    ? "rgba(255,255,255,0.8)"
                    : "transparent",
                  sm: path.includes("/posts")
                    ? "rgba(255,255,255,0.8)"
                    : "transparent",
                  md: path.includes("/posts")
                    ? "rgba(255,255,255,0.8)"
                    : "transparent",
                },
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.7) !important",
                },
              }}
            >
              <Link
                href="/user/posts"
                style={{ color: "inherit", textDecoration: "none" }}
              >
                <Badge badgeContent={4} color="error">
                  <FeedIcon
                    sx={{
                      color: {
                        xs: path.includes("/posts") ? "#1976d3" : "black",
                        sm: path.includes("/posts") ? "#1976d3" : "black",
                        md: path.includes("/posts") ? "#0074ec" : "#fff",
                      },
                      fontSize: 30,
                    }}
                  />
                </Badge>
              </Link>
            </Button>
            <Popover
              id="mouse-over-popover-chat"
              sx={{
                pointerEvents: "none",
                marginTop: "0.3rem",
              }}
              open={open && popoverId === "chat"}
              anchorEl={anchorEl}
              anchorOrigin={{ vertical: "right", horizontal: "right" }}
              transformOrigin={{ vertical: "left", horizontal: "left" }}
              onClose={handlePopoverClose}
              disableRestoreFocus
              disableScrollLock={true}
            >
              <Typography sx={{ p: 1, background: "#474645", color: "#fff" }}>
                Post
              </Typography>
            </Popover>
          </Stack>

          <Stack
            spacing={1}
            className="nav-user-feat"
            sx={{ padding: "1rem 0" }}
          >
            <Menu
              anchorEl={userMenuAnchorEl}
              open={userMenuOpen}
              onClose={handleUserMenuClose}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
          
              disableScrollLock={true}
              sx={{
                mt: 1, // Tạo khoảng cách nhỏ trên đỉnh
                "& .MuiPaper-root": {
                  borderRadius: 2, // Bo tròn góc menu
                  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)", // Đổ bóng nhẹ
                  minWidth: 200, // Đặt chiều rộng tối thiểu cho menu
                },
              }}
            >
              <MenuItem sx={{ paddingY: 1.5 }}>
                <Link
                  href={`/user/profile?id=${user?._id}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                  onClick={() => handleUserMenuClose()}
                >
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Avatar
                      alt="AVATAR"
                      src={
                        profileData.avatar
                          ? profileData.avatar?.content.media[0].media_url
                          : USER_AVATAR_ORIGINAL
                      }
                      sx={{ width: 34, height: 34 }}
                    />
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {user?.name || "User Name"}
                    </Typography>
                  </Stack>
                </Link>
              </MenuItem>

              {/* Đường chia cách */}
              <Divider sx={{ marginY: 1 }} />

              <MenuItem onClick={handleLogout} sx={{ paddingY: 1.5 }}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <LogoutIcon fontSize="small" />
                  <Typography variant="body1">Logout</Typography>
                </Stack>
              </MenuItem>
            </Menu>
            <IconButton onClick={handleUserMenuOpen} sx={{ p: 0 }}>
              <Avatar
                alt="AVATAR"
                src={
                  profileData.avatar
                    ? profileData.avatar?.content.media[0].media_url
                    : USER_AVATAR_ORIGINAL
                }
              />
            </IconButton>
            
          </Stack>
        </Stack>
      </Stack>
    </AppBar>
  );
};

export default NavBar;
