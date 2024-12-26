"use client";

import React, { useEffect, useRef, useState } from "react";
import { Box, Stack, Typography, IconButton } from "@mui/material";
import CallEndIcon from "@mui/icons-material/CallEnd";
import PhoneInTalkIcon from "@mui/icons-material/PhoneInTalk";
import { useStringee } from "@/contexts/StringeeContext";
import { useDispatch, useSelector } from "react-redux";
import { getUserProfile } from "@/utils/services/profileService/profileDetails";
import { findChatByParticipants } from "@/utils/services/chatService/chatService";
import { useSocket } from "@/contexts/SocketContext";
import VideocamIcon from '@mui/icons-material/Videocam';

const ComingCall = () => {
  const { incomingCall, isCalling, answerCall, rejectCall, endCall } =
    useStringee();
  const [callerProfile, setCallerProfile] = useState(null);
  const [chat, setChat] = useState(null);
  const [callType, setCallType] = useState("");
  const { user } = useSelector((state) => state.auth);
  const [isCalled, setIsCalled] = useState(false);
  const { handleSendCallMessage } = useSocket();
  const ringtoneRef = useRef(null);

  useEffect(() => {
    ringtoneRef.current = new Audio("/onepiece.mp3");
    ringtoneRef.current.loop = true;
    console.log("ringtoneRef", ringtoneRef);

    if (incomingCall) {
      console.log("Playing ringtone...");
      const playRingtone = async () => {
        try {
          await ringtoneRef.current.play();
        } catch (err) {
          console.error("Failed to play ringtone:", err);
        }
      };
      playRingtone();
    }
    setIsCalled(user?._id.toString() === incomingCall?.toNumber.toString());
    const getChatOfCall = async () => {
      const result = await findChatByParticipants({
        userId: incomingCall?.fromNumber,
        participantId: incomingCall?.toNumber,
      });
      setChat(result);
    };
    getChatOfCall();
    return () => {
      if (ringtoneRef.current) {
        ringtoneRef.current.pause();
        ringtoneRef.current.currentTime = 0;
      }
    };
  }, [incomingCall, isCalling]);

  useEffect(() => {
    const getCallerProfile = async () => {
      if (incomingCall) {
        const response = await getUserProfile({
          userId: incomingCall?.fromNumber,
        });
        setCallerProfile(response);
        console.log("caller profile", incomingCall?.fromNumber);
      }
    };
    getCallerProfile();
    if(incomingCall?.isVideoCall) {
      setCallType("video");
    }
    else {
      setCallType("audio");
    }

  }, [incomingCall]);


  const handleRejectCall = async () => {
    if (ringtoneRef.current) {
      ringtoneRef.current.pause();
    }
    await handleSendCallMessage(
      incomingCall?.fromNumber,
      chat?._id,
      0,
      false,
      true,
      callType
    );
    rejectCall();
  };

  const handleAnswerCall = () => {
    if (ringtoneRef.current) {
      ringtoneRef.current.pause();
    }
    answerCall();
  };

  return (
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        backgroundColor: "white",
        padding: 3,
        borderRadius: 2,
        boxShadow: 3,
        textAlign: "center",
        width: 300,
        zIndex: 100,
      }}
    >
      <Typography variant="h6" gutterBottom>
        {callerProfile?.userName} đang gọi...
      </Typography>

      <Stack direction="row" justifyContent="center" spacing={3} sx={{ mt: 2 }}>
        {/* Nút từ chối */}
        <IconButton
          onClick={isCalling ? handleRejectCall : endCall}
          sx={{
            backgroundColor: "red",
            color: "white",
            "&:hover": { backgroundColor: "darkred" },
          }}
        >
          <CallEndIcon />
        </IconButton>

        {/* Nút chấp nhận */}
        {isCalled && (
          <IconButton
            onClick={handleAnswerCall}
            sx={{
              backgroundColor: "green",
              color: "white",
              "&:hover": { backgroundColor: "darkgreen" },
            }}
          >
            {incomingCall.isVideoCall ? <VideocamIcon/> : <PhoneInTalkIcon />}
          </IconButton>
        )}
      </Stack>
    </Box>
  );
};

export default ComingCall;
