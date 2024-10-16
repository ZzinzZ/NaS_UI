"use client";
import { Box, IconButton, Stack, TextField, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  deleteUserSearchHistory,
  getUserSearchHistory,
  searchUserProfile,
} from "@/utils/services/searchService/searchUserService";
import ClearIcon from "@mui/icons-material/Clear";
import SearchLoading from "../generals/SearchLoading";
import SearchResultItem from "./SearchResultItem";


const SearchFriend = () => {
  const [searchHistories, setSearchHistories] = useState([]);
  const [searchKeywords, setSearchKeywords] = useState("");
  const [profileList, setProfileList] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const { user } = useSelector((state) => state.auth);


  const getSearchHistories = async () => {
    try {
      const list = await getUserSearchHistory({ userId: user?._id });
      setSearchHistories(list);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteSearchHistories = async (searchId) => {
    try {
      await deleteUserSearchHistory({ searchId: searchId });
      setSearchHistories(
        searchHistories.filter((item) => item._id !== searchId)
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = async () => {
    setIsSearching(true);
    try {
      if (searchKeywords.trim()) {
        const profiles = await searchUserProfile({
          userName: searchKeywords,
          userId: user?._id,
        });
        setProfileList(profiles);
        setSearchHistories([
         ...searchHistories,
        ]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  useEffect(() => {
    getSearchHistories();
  }, []);

  

  return (
    <Box>
      <Stack spacing={1}>
        <Box
          sx={{
            background: "#fff",
            borderRadius: "1rem",
            padding: "0.5rem",
            boxShadow: "0 1px 2px rgba(0,0,0,0.2)",
          }}
        >
          {/*SearchBar*/}
          <Stack>
            <Stack justifyContent="center" alignItems="center">
              <Stack
                direction="row"
                alignItems="center"
                sx={{
                  width: "90%",
                  border: "1px solid #e5e6eb",
                  borderRadius: "2rem",
                  padding: "0 0.5rem 0 1rem",
                  background: "#f1f2f6",
                }}
              >
                <TextField
                  autoComplete="off"
                  placeholder="Enter Username"
                  value={searchKeywords}
                  onChange={(e) => setSearchKeywords(e.target.value)}
                  onKeyDown={handleKeyDown}
                  sx={{
                    width: "100%",
                    "& .MuiOutlinedInput-root": {
                      border: "none",
                      "& fieldset": {
                        border: "none",
                      },
                      "&:hover fieldset": {
                        border: "none",
                      },
                      "&.Mui-focused fieldset": {
                        border: "none",
                      },
                    },
                  }}
                />
                <IconButton
                  sx={{ background: "#1976d3" }}
                  onClick={handleSearch}
                >
                  <SearchIcon sx={{ color: "#fff" }} />
                </IconButton>
              </Stack>
            </Stack>
            <Stack spacing={1} sx={{ padding: "1rem" }}>
              <Typography>Search Histories</Typography>
              <Stack
                direction="row"
                spacing={1}
                sx={{ flexWrap: "wrap", rowGap: "0.8rem" }}
              >
                {searchHistories?.map((search) => (
                  <Stack
                    spacing={0.5}
                    key={search?._id}
                    direction="row"
                    alignItems="center"
                    sx={{
                      background: "#f1f2f6",
                      borderRadius: "1rem",
                      padding: "0.3rem",
                      marginTop: "0.3rem",
                    }}
                  >
                    <Typography
                      sx={{
                        marginLeft: "0.5rem",
                        color: "#5e656f",
                        fontSize: "0.8rem",
                        cursor: "pointer",
                      }}
                      onClick={() => setSearchKeywords(search.keyword)}
                    >
                      {search.keyword}
                    </Typography>
                    <ClearIcon
                      sx={{
                        color: "#5e656f",
                        fontSize: "0.9rem",
                        cursor: "pointer",
                      }}
                      onClick={() => deleteSearchHistories(search._id)}
                    />
                  </Stack>
                ))}
              </Stack>
            </Stack>
          </Stack>
        </Box>
        {isSearching && <SearchLoading />}
        {
          !isSearching && (
            <Stack spacing={1}>
              {profileList?.map((profile) => (
                <Box key={profile._id}>
                    <SearchResultItem  profile={profile} />
                </Box>
              ))}
            </Stack>
          )
        }
      </Stack>
    </Box>
  );
};

export default SearchFriend;
