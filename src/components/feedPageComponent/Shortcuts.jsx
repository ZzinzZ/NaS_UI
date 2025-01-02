"use client";
import {
  findChatByParticipants,
  getGroupChats,
} from "@/utils/services/chatService/chatService";
import {
  getListFriendShortcuts,
  getSuggestedProfiles,
  getUnfriendedProfiles,
} from "@/utils/services/profileService/getListFriend";
import { Avatar, Box, Stack, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Shortcuts = () => {
  const [groupList, setGroupList] = useState([]);
  const [friendList, setFriendList] = useState([]);
  const [noFriendList, setNoFriendList] = useState([]);
  const [suggestList, setSuggestList] = useState([]);
  const { user = null } = useSelector((state) => state.auth ?? {});

  const router = useRouter();
  const handleGetGroupList = async () => {
    const list = await getGroupChats({ userId: user._id });
    setGroupList(list);
  };

  const handleGetFriendList = async () => {
    const list = await getListFriendShortcuts({ userId: user._id });
    setFriendList(list);
  };
  const handleGetNoFriendList = async () => {
    const list = await getUnfriendedProfiles({ userId: user._id });
    setNoFriendList(list);
  };
  const handleGetSuggestList = async () => {
    const list = await getSuggestedProfiles({ userId: user._id });
    setSuggestList(list);
  };

  const handleNavigateToGroupChat = (chatId) => {
    router.push(`/user?chat-id=${chatId}`);
  };

  const handleGoToChat = async (userId) => {
    if (!user?._id || !userId) {
      return;
    }

    try {
      // Tìm đoạn chat
      const chat = await findChatByParticipants({
        userId: user._id,
        participantId: userId,
      });
      if (chat) {
        router.push(`/user?chat-id=${chat?._id}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleNavigateToProfile = (userId) => {
    router.push(`/user/profile?id=${userId}`);
  };

  useEffect(() => {
    handleGetGroupList();
    handleGetFriendList();
    handleGetNoFriendList();
    handleGetSuggestList();
  }, []);

  return (
    <Box
      sx={{
        background: "#fff",
        padding: "1rem",
        marginBottom: "1rem",
        borderRadius: "0.5rem",
        width: "100%",
        boxShadow: "0 1px 2px rgba(0,0,0,0.2)",
        display: { sm: "none", md: "block", xs: "none" },
        height: "100vh",
        overflowY: "scroll",
        "&::-webkit-scrollbar": {
          display: "none",
        },
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
    >
      <Stack sx={{ backgroundColor: "#fff", width: "100%", height: "100%" }}>
        {friendList?.length > 0 ? (
          <Stack>
            <Typography variant="h6">Shortcuts</Typography>
            {friendList?.map((friend) => (
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{
                  padding: "1rem",
                  borderRadius: "1rem",
                  cursor: "pointer",
                  transition: "background-color 0.2s ease-in-out",
                  "&:hover": { backgroundColor: "#f2f2f2" },
                }}
                key={friend?.userId}
                onClick={() => handleGoToChat(friend?.userId)}
              >
                <Avatar src={friend?.avatar?.content?.media[0]?.media_url} />
                <Typography>{friend?.userName}</Typography>
              </Stack>
            ))}
          </Stack>
        ) : null}
        <Stack>
          {groupList?.length > 0 ? (
            <Stack>
              <Typography variant="h6">Groups</Typography>
              {groupList?.map((group) => (
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  sx={{
                    padding: "1rem",
                    borderRadius: "1rem",
                    cursor: "pointer",
                    transition: "background-color 0.2s ease-in-out",
                    "&:hover": { backgroundColor: "#f2f2f2" },
                  }}
                  key={group?._id}
                  onClick={() => handleNavigateToGroupChat(group?._id)}
                >
                  <Avatar src={group?.avatar} />
                  <Typography>{group?.chat_name}</Typography>
                </Stack>
              ))}
            </Stack>
          ) : null}
          {noFriendList?.length > 0 ? (
            <Stack>
              <Typography variant="h6">Suggested Connections</Typography>
              {noFriendList?.map((friend) => (
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  sx={{
                    padding: "1rem",
                    borderRadius: "1rem",
                    cursor: "pointer",
                    transition: "background-color 0.2s ease-in-out",
                    "&:hover": { backgroundColor: "#f2f2f2" },
                  }}
                  key={friend?.userId}
                  onClick={() => handleNavigateToProfile(friend?.userId)}
                >
                  <Avatar src={friend?.avatar?.content?.media[0]?.media_url} />
                  <Typography>{friend?.userName}</Typography>
                </Stack>
              ))}
            </Stack>
          ) : null}
          {suggestList?.length > 0 ? (
            <Stack>
              <Typography variant="h6">Mutual Friends</Typography>
              {suggestList?.map((friend) => (
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  sx={{
                    padding: "1rem",
                    borderRadius: "1rem",
                    cursor: "pointer",
                    transition: "background-color 0.2s ease-in-out",
                    "&:hover": { backgroundColor: "#f2f2f2" },
                  }}
                  key={friend?.userId}
                  onClick={() => handleNavigateToProfile(friend?.userId)}
                >
                  <Avatar src={friend?.avatar?.content?.media[0]?.media_url} />
                  <Typography>{friend?.userName}</Typography>
                </Stack>
              ))}
            </Stack>
          ) : null}
        </Stack>
      </Stack>
    </Box>
  );
};

export default Shortcuts;
