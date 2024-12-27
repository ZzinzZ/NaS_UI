"use client"
import React from 'react'
import GroupIcon from '@mui/icons-material/Group';
import PersonIcon from '@mui/icons-material/Person';
import FavoriteIcon from '@mui/icons-material/Favorite';


const RelationshipIcon = ({type_relationship}) => {
  switch (type_relationship) {
    case 'married':
      return <GroupIcon sx={{color: "#78d0fe"}}/>;
    case 'single':
      return <PersonIcon />;
    case 'dating':
      return <FavoriteIcon sx={{color: "#fe2c55"}}/>;
    default:
      return null;
  }
}

export default RelationshipIcon