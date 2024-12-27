import React, { useState } from 'react';
import { 
  InputAdornment, 
  TextField, 
  IconButton, 
  Collapse, 
  Box 
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';

const SearchInput = ({ onSearch, onClear }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSearch = () => {
    if (searchTerm.trim()) {
      onSearch(searchTerm);
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    onClear();
    setIsExpanded(false);
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      setTimeout(() => document.getElementById('search-input').focus(), 300);
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
      <Collapse in={isExpanded} orientation="horizontal" timeout={300}>
        <TextField
          id="search-input"
          fullWidth
          variant="outlined"
          size="small"
          value={searchTerm}
        //   onBlur={() => handleClear()}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="Search messages..."
          sx={{
            width: isExpanded ? '250px' : '0px',
            transition: 'width 0.3s',
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'transparent',
              },
              '&:hover fieldset': {
                borderColor: 'transparent',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'transparent',
              },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: searchTerm && (
              <InputAdornment position="end">
                <IconButton size="small" onClick={handleClear}>
                  <CloseIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Collapse>
      {!isExpanded && (
        <IconButton onClick={toggleExpand} size="small" sx={{ ml: 1 }}>
          <SearchIcon sx={{color:"#1976d3"}}/>
        </IconButton>
      )}
    </Box>
  );
};

export default SearchInput;

    