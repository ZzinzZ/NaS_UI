"use client";
import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import MessageIcon from "@mui/icons-material/Message";
import GroupsIcon from "@mui/icons-material/Groups";
import NotificationsIcon from "@mui/icons-material/Notifications";
import {
  Container,
  Stack,
  Badge,
  Button,
  Popover,
  Typography,
  Menu,
  MenuItem,
  IconButton,
  Avatar,
} from "@mui/material";
import Link from "next/link";
import Image from "next/image";
import Cookies from 'js-cookie';
import { useDispatch } from 'react-redux';
import { logout } from '@/redux/slices/AuthSlice'; // Giả sử bạn có một action để xóa token

const NavBar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [popoverId, setPopoverId] = useState(null);
  const [userMenuAnchorEl, setUserMenuAnchorEl] = useState(null);
  const dispatch = useDispatch();

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
  const handleNavProfile = () => {

  }

  const open = Boolean(anchorEl);
  const userMenuOpen = Boolean(userMenuAnchorEl);

  return (
    <AppBar
      className="app-navbar"
      position="fixed"
      sx={{ height: "3.75rem", top: 0, zIndex: 3, background: "#ffff" }}
    >
      <Toolbar>
        <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>
          <Image
            src="/NA_logo.jpg"
            alt="NaSocial"
            className="App-logo"
            width={30}
            height={30}
          />
        </Link>
        <Container>
          <Stack direction="row" className="nav-container">
            <Stack className="nav-search" direction="row">
              <SearchIcon sx={{ color: "#ccc" }} />
              <InputBase className="nav-search-input" placeholder="Search..." />
            </Stack>
            <Stack className="nav-page" direction="row" spacing={2}>
              <Button
                className="nav-page-button current-page"
                aria-owns={open && popoverId === "home" ? "mouse-over-popover-home" : undefined}
                onMouseEnter={(e) => handlePopoverOpen(e, "home")}
                onMouseLeave={handlePopoverClose}
              >
                <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>
                  <HomeOutlinedIcon sx={{ color: "#686b68", fontSize: 30 }} />
                </Link>
              </Button>
              <Popover
                id="mouse-over-popover-home"
                sx={{ pointerEvents: "none", marginTop: "0.3rem" }}
                open={open && popoverId === "home"}
                anchorEl={anchorEl}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                transformOrigin={{ vertical: "top", horizontal: "center" }}
                onClose={handlePopoverClose}
                disableRestoreFocus
              >
                <Typography sx={{ p: 1, background: "#474645", color: "#fff" }}>Home</Typography>
              </Popover>

              <Button
                className="nav-page-button"
                aria-owns={open && popoverId === "friends" ? "mouse-over-popover-friends" : undefined}
                onMouseEnter={(e) => handlePopoverOpen(e, "friends")}
                onMouseLeave={handlePopoverClose}
              >
                <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>
                  <GroupOutlinedIcon sx={{ color: "#686b68", fontSize: 30 }} />
                </Link>
              </Button>
              <Popover
                id="mouse-over-popover-friends"
                sx={{ pointerEvents: "none", marginTop: "0.3rem" }}
                open={open && popoverId === "friends"}
                anchorEl={anchorEl}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                transformOrigin={{ vertical: "top", horizontal: "center" }}
                onClose={handlePopoverClose}
                disableRestoreFocus
              >
                <Typography sx={{ p: 1, background: "#474645", color: "#fff" }}>Friends</Typography>
              </Popover>

              <Button
                className="nav-page-button"
                aria-owns={open && popoverId === "groups" ? "mouse-over-popover-groups" : undefined}
                onMouseEnter={(e) => handlePopoverOpen(e, "groups")}
                onMouseLeave={handlePopoverClose}
              >
                <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>
                  <GroupsIcon sx={{ color: "#686b68", fontSize: 30 }} />
                </Link>
              </Button>
              <Popover
                id="mouse-over-popover-groups"
                sx={{ pointerEvents: "none", marginTop: "0.3rem" }}
                open={open && popoverId === "groups"}
                anchorEl={anchorEl}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                transformOrigin={{ vertical: "top", horizontal: "center" }}
                onClose={handlePopoverClose}
                disableRestoreFocus
              >
                <Typography sx={{ p: 1, background: "#474645", color: "#fff" }}>Groups</Typography>
              </Popover>

              <Button
                className="nav-page-button"
                aria-owns={open && popoverId === "chat" ? "mouse-over-popover-chat" : undefined}
                onMouseEnter={(e) => handlePopoverOpen(e, "chat")}
                onMouseLeave={handlePopoverClose}
              >
                <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>
                  <MessageIcon sx={{ color: "#686b68", fontSize: 30 }} />
                </Link>
              </Button>
              <Popover
                id="mouse-over-popover-chat"
                sx={{ pointerEvents: "none", marginTop: "0.3rem" }}
                open={open && popoverId === "chat"}
                anchorEl={anchorEl}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                transformOrigin={{ vertical: "top", horizontal: "center" }}
                onClose={handlePopoverClose}
                disableRestoreFocus
              >
                <Typography sx={{ p: 1, background: "#474645", color: "#fff" }}>Chat</Typography>
              </Popover>
            </Stack>

            <Stack direction="row" spacing={1} className="nav-user-feat">
              <div className="nav-notification-button">
                <Badge badgeContent={4} color="primary">
                  <NotificationsIcon sx={{ color: "#686b68" }} />
                </Badge>
              </div>
              <IconButton onClick={handleUserMenuOpen} sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" src="images.jpg"/>
              </IconButton>
              <Menu
                anchorEl={userMenuAnchorEl}
                open={userMenuOpen}
                onClose={handleUserMenuClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                transformOrigin={{ vertical: "top", horizontal: "center" }}
              >
                <MenuItem><Link href="/user/profile" style={{ textDecoration: 'none', color:"#000" }}>Profile</Link></MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </Stack>
          </Stack>
        </Container>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
