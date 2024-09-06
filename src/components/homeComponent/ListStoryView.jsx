import React from 'react';
import { Avatar, Box, IconButton, Stack, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import StoryItem from './StoryItem';

const StoryListView = ({ stories, onStoryClick }) => {
  return (
    <Box 
      sx={{
        display: 'flex',
        overflowX: 'auto',
        paddingY: 2,
        '&::-webkit-scrollbar': { display: 'none' },
      }}
    >
      <Stack direction="row">
      <Box 
      sx={{
        position: 'relative',
        width: 100,
        height: 180,
        borderRadius: '15px',
        overflow: 'hidden',
        boxShadow: 2,
        cursor: 'pointer',
        marginRight:"1rem",
      }}
    >
      <Avatar
        src="https://i.pinimg.com/736x/49/23/8a/49238a0500ec19ed18e23c0338600a77.jpg"
        alt="User Story"
        variant="rounded"
        sx={{
          width: '100%',
          height: '70%',
          objectFit: 'cover',
        }}
      />
      <Box 
        sx={{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          backgroundColor: '#fff',
          textAlign: 'center',
          padding: '8px 0',
        }}
      >
        <IconButton
          variant="contained"
          color="primary"
          sx={{
            minWidth: 0,
            padding: 0.5,
            borderRadius: '50%',
            marginBottom: 0.5,
            boxShadow: 1,
          }}
        >
          <AddIcon fontSize="small" />
        </IconButton>
      </Box>
    </Box>
      {stories.map((story, index) => (
        <StoryItem
          key={index}
          mediaUrl={story.mediaUrl}
          userName={story.userName}
          timeAgo={story.timeAgo}
          onClick={() => onStoryClick(story)}
        />
      ))}
      </Stack>
    </Box>
  );
};

export default StoryListView;
