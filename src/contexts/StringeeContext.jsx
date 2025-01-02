"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";

const StringeeContext = createContext();

export const useStringee = () => useContext(StringeeContext);

export const StringeeProvider = ({ children }) => {
  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);
  const [incomingCall, setIncomingCall] = useState(null);
  const [isCalling, setIsCalling] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [calleeLocal, setCalleeLocal] = useState(null);
  const [calleeRemote, setCalleeRemote] = useState(null);
  const [is_accepted, setIs_accepted] = useState(false);
  const [is_rejected, setIs_rejected] = useState(false);
  const { stringeeToken = null } = useSelector((state) => state.auth ?? {});

  useEffect(() => {
    if (!stringeeToken) {
      return;
    }

    if (!window.StringeeClient) {
      return;
    }

    const stringeeClient = new window.StringeeClient();
    stringeeClient.connect(stringeeToken);

    stringeeClient.on("connect", () => {
      setIsConnected(true);
    });

    stringeeClient.on("disconnect", () => {
      setIsConnected(false);
    });

    stringeeClient.on("authen", (res) => {
      console.log("Kết quả xác thực:", res);
    });

    stringeeClient.on("incomingcall", (callInstance) => {
      setupCallEvents(callInstance);
      setIncomingCall(callInstance);
      setIsCalling(true);
    });

    setClient(stringeeClient);

    return () => {
      stringeeClient.disconnect();
    };
  }, [stringeeToken]);

  const setupCallEvents = (callInstance) => {
    if (!callInstance) {
      return;
    }
    callInstance.on("addremotestream", (stream) => {
      const remoteVideo = document.getElementById("remoteVideo");
      setCalleeRemote(stream);
      if (remoteVideo) {
        remoteVideo.srcObject = stream;
      } else {
        console.error("Không tìm thấy remoteVideo element.");
      }
    });

    callInstance.on("addlocalstream", (stream) => {
      const localVideo = document.getElementById("localVideo");
      setCalleeLocal(stream);
      if (localVideo) {
        localVideo.srcObject = null;
        localVideo.srcObject = stream;
      } else {
        console.error("Không tìm thấy localVideo element.");
      }
    });

    callInstance.on("signalingstate", (state) => {
      if (state.code === 6 || state.code === 5) {
        resetCallState();
      }
      if (state.code === 3) {
        setIsCalling(false);
        setIs_accepted(true);
        setIs_rejected(false);
      }
    });
    call;
    callInstance.on("mediastate", (state) => {
      console.log(state);
    });

    callInstance.on("info", (info) => {
      console.log(info);
    });

    callInstance.on("otherdevice", (data) => {
      console.log(data);
    });
  };

  const resetCallState = () => {
    setCall(null);
    setIncomingCall(null);
    setIsCalling(false);

    const localVideo = document.getElementById("localVideo");
    const remoteVideo = document.getElementById("remoteVideo");

    if (localVideo) localVideo.srcObject = null;
    if (remoteVideo) remoteVideo.srcObject = null;
  };

  const makeCall = (callerId, calleeId, isVideoCall) => {
    if (!client) {
      return;
    }

    const newCall = new window.StringeeCall(
      client,
      callerId,
      calleeId,
      isVideoCall
    );
    setCall(newCall);
    setupCallEvents(newCall);
    setIsCalling(true);
    newCall.makeCall((res) => {
      if (res.r === 0) {
        console.log("Cuộc gọi bắt đầu thành công");
      } else {
        console.error("Cuộc gọi thất bại:", res);
      }
    });
  };

  const answerCall = () => {
    if (!incomingCall) {
      console.error("Không có cuộc gọi để trả lời");
      return;
    }
    setupCallEvents(incomingCall);
    incomingCall.answer((res) => {
      if (res.r === 0) {
        setCall(incomingCall);
        setIncomingCall(null);
        setIsCalling(false);
        setIs_accepted(true);
        setIs_rejected(false);
        const calleeLocalVideo = document.getElementById("localVideo");
        const calleeRemoteVideo = document.getElementById("remoteVideo");

        if (calleeLocalVideo) {
          calleeLocalVideo.srcObject = null;
          calleeLocalVideo.srcObject = calleeLocal;
        }
        if (calleeRemoteVideo) {
          calleeRemoteVideo.srcObject = null;
          calleeRemoteVideo.srcObject = calleeRemote;
        }
      } else {
        console.error("Trả lời cuộc gọi thất bại:", res);
      }
    });
  };

  const rejectCall = () => {
    if (incomingCall) {
      incomingCall.reject((res) => {
        setIs_rejected(true);
        setIs_accepted(false);
      });
    }
    endCall();
    resetCallState();
  };

  const endCall = () => {
    if (call) {
      call.hangup((res) => {
        console.log("Đã kết thúc cuộc gọi:", res);
      });
    } else if (incomingCall) {
      incomingCall.hangup((res) => {
        console.log("Đã kết thúc cuộc gọi:", res);
      });
    }
    resetCallState();
  };

  const mute = () => {
    if (!call) {
      return;
    }

    var muted = !call.muted;
    call.mute(muted);
  };

  const upgradeToVideoCall = () => {
    if (!call) {
      return;
    }
    call.upgradeToVideoCall();
  };

  const enableVideo = () => {
    var success;
    if (call.localVideoEnabled) {
      success = call.enableLocalVideo(false);
    } else {
      success = call.enableLocalVideo(true);
    }
  };

  return (
    <StringeeContext.Provider
      value={{
        client,
        makeCall,
        answerCall,
        rejectCall,
        endCall,
        incomingCall,
        isConnected,
        setupCallEvents,
        calleeLocal,
        calleeRemote,
        isCalling,
        currentCall: call,
        mute,
        upgradeToVideoCall,
        enableVideo,
        is_accepted,
        is_rejected,
      }}
    >
      {children}
    </StringeeContext.Provider>
  );
};
