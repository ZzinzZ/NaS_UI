"use client";

import React, { useEffect, useState } from "react";
import { Box, Typography, IconButton, Stack, Avatar } from "@mui/material";
import CallEndIcon from "@mui/icons-material/CallEnd";
import MicOffIcon from "@mui/icons-material/MicOff";
import MicIcon from "@mui/icons-material/Mic";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import VideocamIcon from "@mui/icons-material/Videocam";
import { useStringee } from "@/contexts/StringeeContext";
import { useSelector } from "react-redux";
import { getUserProfile } from "@/utils/services/profileService/profileDetails";
import { useSocket } from "@/contexts/SocketContext";
import { findChatByParticipants } from "@/utils/services/chatService/chatService";

const CallWindow = () => {
  const {
    endCall,
    currentCall,
    setupCallEvents,
    calleeLocal,
    calleeRemote,
    mute,
    enableVideo,
    is_accepted,
    is_rejected,
    upgradeToVideoCall,
  } = useStringee();
  const [callDuration, setCallDuration] = useState(0);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [localProfile, setLocalProfile] = useState(null);
  const [remoteProfile, setRemoteProfile] = useState(null);
  const [otherUserProfile, setOtherUserProfile] = useState(null);
  const [callType, setCallType] = useState("");
  const [chat, setChat] = useState(null);
  const { user } = useSelector((state) => state.auth);
  const {
    handleSendCallMessage,
    micOffSocket,
    micOnSocket,
    cameraOffSocket,
    cameraOnSocket,
    cameraOff,
    micOff,
    setCameraOff,
    setMicOff,
  } = useSocket();

  const handleGetUserProfile = async (userId) => {
    const response = await getUserProfile({ userId });
    return response;
  };

  useEffect(() => {
    let timer;
    if (currentCall) {
      timer = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);

      const fetchProfile = async () => {
        const fromProfile = await handleGetUserProfile(currentCall?.fromNumber);
        const toProfile = await handleGetUserProfile(currentCall?.toNumber);
        if (user?._id == fromProfile?.userId) {
          setLocalProfile(fromProfile);
          setRemoteProfile(toProfile);
          setOtherUserProfile(toProfile);
        } else {
          setLocalProfile(toProfile);
          setRemoteProfile(fromProfile);
          setOtherUserProfile(fromProfile);
        }
        console.log(fromProfile);
      };
      fetchProfile();
    }
    const getChatOfCall = async () => {
      const result = await findChatByParticipants({
        userId: currentCall?.fromNumber,
        participantId: currentCall?.toNumber,
      });
      setChat(result);
    };
    getChatOfCall();
    if (currentCall?.isVideoCall) {
      setCallType("video");
    } else {
      setCallType("audio");
    }

    return () => {
      clearInterval(timer);
      setCallDuration(0);
    };
  }, [currentCall]);

  const formatTime = (duration) => {
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  useEffect(() => {
    setupCallEvents(currentCall);
    const localVideo = document.getElementById("localVideo");
    const remoteVideo = document.getElementById("remoteVideo");
    if (!localVideo) {
      console.error("Local video element not found");
    }
    if (localVideo) {
      localVideo.srcObject = null;
      localVideo.srcObject = calleeLocal;
    } else {
      console.error("Local video or stream not available.");
    }

    if (remoteVideo && calleeRemote) {
      remoteVideo.srcObject = null;
      remoteVideo.srcObject = calleeRemote;
    }
  }, [calleeRemote, calleeLocal]);

  const handleToggleMic = () => {
    setIsMicMuted((prev) => {
      return !prev;
    });
    if (isMicMuted) {
      micOnSocket(user, otherUserProfile?.userId);
    } else {
      micOffSocket(user, otherUserProfile?.userId);
    }
    mute();
  };

  const handleToggleCamera = () => {
    if (callType === "audio") {
      upgradeToVideoCall();
      setCallType("video");
      return;
    }

    setIsCameraOff(!isCameraOff);
    if (isCameraOff) {
      cameraOnSocket(user, otherUserProfile?.userId);
    } else {
      cameraOffSocket(user, otherUserProfile?.userId);
    }
    enableVideo();
  };

  const handleEndCall = async () => {
    await handleSendCallMessage(
      currentCall?.fromNumber,
      chat?._id,
      callDuration,
      is_accepted,
      is_rejected,
      callType
    );
    setCameraOff(null);
    setMicOff(null);
    endCall();
  };

  return (
    <Box
      sx={{
        position: "absolute",
        width: "80vw",
        height: "80vh",
        backgroundColor: "white",
        borderRadius: 4,
        boxShadow: 6,
        overflow: "hidden",
        margin: "auto",
        top: "10%",
        left: "10%",
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Remote Video */}
      <Box
        sx={{
          position: "absolute",
          width: "100%",
          height: "100%",
        }}
      >
        <video
          id="remoteVideo"
          autoPlay
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: "rotateY(180deg)",
            backgroundImage: `url(${remoteProfile?.avatar?.content?.media[0]?.media_url})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: callType === "video" ? "blur(0px)" : "blur(5px)",
          }}
        ></video>
      </Box>

      {/* Local Video */}
      <Box
        sx={{
          position: "absolute",
          top: 16,
          right: 16,
          width: "120px",
          height: "90px",
          borderRadius: 2,
          overflow: "hidden",
          boxShadow: currentCall?.isVideoCall ? 3 : 0,
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {currentCall?.isVideoCall && (
          <Box
            sx={{
              width: "100%",
              height: "100%",
              backgroundImage: `url(${localProfile?.avatar?.content?.media[0]?.media_url})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "blur(5px)",
              backgroundColor: "#ccc",
              display: isCameraOff ? "block" : "none",
            }}
          ></Box>
        )}
        <video
          id="localVideo"
          muted
          autoPlay
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: "rotateY(180deg)",
            display:
              !isCameraOff || currentCall?.isVideoCall ? "block" : "none",
          }}
        ></video>
      </Box>

      {/* Controls */}
      <Stack
        sx={{
          background: micOff !== null || cameraOff !== null ? "#323232" : "transparent",
          color: "#fff",
          position: "absolute",
          bottom: "100px",
          left: "50%",
          transform: "translateX(-50%)",
          padding: "1rem 2rem",
          borderRadius: "1rem",
          textAlign: "center",
          zIndex: 1000,
        }}
      >
        {micOff !== null && cameraOff === null && (
          <Box sx={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Typography
              sx={{
                fontSize: "1rem",
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              🎙️ {micOff?.name} is turning off the mic
            </Typography>
          </Box>
        )}
        {cameraOff !== null && micOff === null && (
          <Box sx={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Typography
              sx={{
                fontSize: "1rem",
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              📷 {cameraOff?.name} is turning off the camera
            </Typography>
          </Box>
        )}
        {cameraOff !== null && micOff !== null && (
          <Box sx={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Typography
              sx={{
                fontSize: "1rem",
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              🎙️📷 {cameraOff?.name} is turning off the mic and camera
            </Typography>
          </Box>
        )}
      </Stack>

      <Stack
        direction="row"
        spacing={2}
        sx={{
          position: "absolute",
          bottom: 16,
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        <IconButton
          onClick={handleEndCall}
          sx={{
            backgroundColor: "red",
            color: "white",
            padding: 1.5,
            "&:hover": { backgroundColor: "darkred" },
          }}
        >
          <CallEndIcon sx={{ fontSize: 28 }} />
        </IconButton>

        <IconButton
          onClick={handleToggleMic}
          sx={{
            backgroundColor: isMicMuted ? "gray" : "white",
            color: isMicMuted ? "white" : "black",
            padding: 1.5,
            "&:hover": {
              backgroundColor: isMicMuted ? "darkgray" : "lightgray",
            },
          }}
        >
          {isMicMuted ? (
            <MicOffIcon sx={{ fontSize: 28 }} />
          ) : (
            <MicIcon sx={{ fontSize: 28 }} />
          )}
        </IconButton>

        <IconButton
          sx={{
            backgroundColor: isCameraOff ? "gray" : "white",
            color: isCameraOff ? "white" : "black",
            padding: 1.5,
            "&:hover": {
              backgroundColor: isCameraOff ? "darkgray" : "lightgray",
            },
          }}
          onClick={handleToggleCamera}
        >
          {isCameraOff ? (
            <VideocamOffIcon sx={{ fontSize: 28 }} />
          ) : (
            <VideocamIcon sx={{ fontSize: 28 }} />
          )}
        </IconButton>
      </Stack>

      {/* Call Duration */}
      <Typography
        sx={{
          position: "absolute",
          top: 16,
          left: 16,
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          color: "white",
          padding: "4px 8px",
          borderRadius: 2,
        }}
      >
        {formatTime(callDuration)}
      </Typography>
    </Box>
  );
};

export default CallWindow;
