import React from 'react';
import { Box, Typography, Avatar } from '@mui/material';

const StoryItem = ({ mediaUrl, userName, timeAgo, onClick }) => {
  return (
    <Box 
      sx={{
        position: 'relative',
        width: 100,
        height: 180,
        marginRight: 2,
        cursor: 'pointer',
      }}
      onClick={onClick}
    >
      <Avatar
        src={mediaUrl}
        alt={`${userName}'s story`}
        variant="rounded"
        sx={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          borderRadius: '15px',
        }}
      />
      <Box 
        sx={{
          position: 'absolute',
          bottom: 10,
          left: 10,
          color: 'white',
          textShadow: '0px 0px 5px rgba(0, 0, 0, 0.8)',
        }}
      >
        <Typography variant="body2" fontWeight="bold">
          {userName}
        </Typography>
        <Typography variant="caption">{timeAgo}</Typography>
      </Box>
    </Box>
  );
};

export default StoryItem;
