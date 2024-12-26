"use client";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Stack } from "@mui/material";
import React, { useState } from "react";
import SearchFriend from "./SearchFriend";
import FriendRequestList from "./FriendRequestList";
import RequestSentList from "./RequestSentList";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

const FriendNav = () => {
  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box>
      <Stack direction="row">
        <Box
          sx={{
            background: "#fff",
            width: "23vw",
            height: "100vh",
            boxShadow: "0 1px 2px rgba(0,0,0,0.2)",
          }}
        >
          <Stack>
            <Typography variant="h6" sx={{ padding: "1rem 0 1rem 1rem" }}>
              Friends
            </Typography>
            <Stack>
              <Tabs
                orientation="vertical"
                variant="scrollable"
                value={value}
                onChange={handleChange}
                aria-label="Vertical tabs example"
                sx={{ borderRight: 1, borderColor: "divider" }}
              >
                <Tab label="Overview" {...a11yProps(0)} />
                <Tab label="Search" {...a11yProps(1)} />
                <Tab label="Friend requests" {...a11yProps(2)} />
                <Tab label="Request sent" {...a11yProps(3)} />
              </Tabs>
            </Stack>
          </Stack>
        </Box>
        <Stack sx={{ width:"100%" }}>
          <TabPanel value={value} index={0}>
            <Stack spacing={1}>
            <FriendRequestList/>
            <RequestSentList/>
            </Stack>
          </TabPanel>
          <TabPanel value={value} index={1}>
            <SearchFriend/>
          </TabPanel>
          <TabPanel value={value} index={2}>
            <FriendRequestList/>
          </TabPanel>
          <TabPanel value={value} index={3}>
            <RequestSentList/>
          </TabPanel>
        </Stack>
      </Stack>
    </Box>
  );
};

export default FriendNav;
