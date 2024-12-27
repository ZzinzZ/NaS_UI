"use client";
import { Stack, useMediaQuery, useTheme, Tabs, Tab, Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import PostCreateComponent from "../profileComponent/PostCreateComponent";
import Shortcuts from "./Shortcuts";
import PostList from "./PostList";
import { getListPost } from "@/utils/services/postService/PostFeature";
import { useSelector } from "react-redux";
import Notifications from "./Notifications";

const PostPageContent = () => {
  const { user } = useSelector((state) => state.auth);
  const [posts, setPosts] = useState([]);
  const theme = useTheme();
  const isPhone = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const [activeTab, setActiveTab] = useState(0);

  const handleGetPosts = async () => {
    const result = await getListPost({ userId: user?._id });
    setPosts(result);
  };

  useEffect(() => {
    handleGetPosts();
  }, []);

  const onNewPost = () => {
    handleGetPosts();
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const renderContent = () => {
    if (isTablet || isPhone) {
      return (
        <Box sx={{ width: '100%' }}>
          <Tabs value={activeTab} onChange={handleTabChange} centered>
            <Tab label="Posts" />
            <Tab label="Notifications" />
          </Tabs>
          <Box sx={{ mt: 2 }}>
            {activeTab === 0 ? (
              <Stack spacing={2}>
                <PostCreateComponent onNew={onNewPost} />
                <PostList posts={posts} />
              </Stack>
            ) : (
              <Notifications />
            )}
          </Box>
        </Box>
      );
    }

    return (
      <>
        <Stack
          sx={{
            width: { md: "50%", xs: "100%" },
            height: "100vh",
            overflowY: "scroll",
            "&::-webkit-scrollbar": {
              display: "none",
            },
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            borderRadius: "0.5rem",
          }}
        >
          <PostCreateComponent onNew={onNewPost} />
          <PostList posts={posts} />
        </Stack>
        {!isPhone && (
          <Stack sx={{ width: { md: "25%", sm: "40%" } }}>
            <Notifications />
          </Stack>
        )}
      </>
    );
  };

  return (
    <Stack 
      direction="row" 
      spacing={2} 
      sx={{ 
        padding: "1rem 1rem 0 1rem",
        justifyContent: isTablet ? 'center' : 'flex-start'
      }}
    >
      {!isPhone && !isTablet && (
        <Stack sx={{ width: "25%" }}>
          <Shortcuts />
        </Stack>
      )}
      {renderContent()}
    </Stack>
  );
};

export default PostPageContent;

