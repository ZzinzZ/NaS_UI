"use client";
import {
  createCallMessage,
  getMessageByChatId,
  markAsRead,
  reactMessage,
  removeMessage,
  replyMessage,
  sendFile,
  sendMessage,
} from "@/utils/services/messageService/message.service";
import {
  createChatNotification,
  getNotificationByUserId,
} from "@/utils/services/notification/notification.service";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { io } from "socket.io-client";

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children, userId }) => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState(null);
  const [receiveMessage, setReceiveMessage] = useState(0);
  const [reactedMessage, setReactedMessage] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [chatBarChange, setChatBarChange] = useState(null);
  const [chatDeleted, setChatDeleted] = useState(null);
  const [chatLeaved, setChatLeaved] = useState(null);
  const [kickChat, setKickChat] = useState(null);
  const [typing, setTyping] = useState([]);
  const [micOff, setMicOff] = useState(null);
  const [cameraOff, setCameraOff] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [countUnreadNotifications, setCountUnreadNotifications] = useState(0);
  const [chatLibrary, setChatLibrary] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [blockedChat, setBlockedChat] = useState(null);

  const chat = useSelector((state) => state.chat.chatData);
  const { user = null } = useSelector((state) => state.auth ?? {});

  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    if (!userId) return;

    if (!socket) {
      const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_SERVER, {
        transports: ["websocket"], // Đảm bảo chỉ dùng WebSocket
        withCredentials: true, // Gửi cookie/session (nếu cần)
      });
      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    } else return;
  }, [userId]);

  useEffect(() => {
    console.log("socket connected", onlineUsers);
  }, [onlineUsers]);

  useEffect(() => {
    if (socket === null) return;

    socket.emit("user_online", userId);
    socket.on("user_online_status", (res) => {
      setOnlineUsers(res);
    });

    return () => {
      socket.off("user_online_status");
    };
  }, [socket, userId]);

  const leaveChatEvent = (chatId) => {
    setChatLeaved(chatId);
  }

  const getChatMessage = async () => {
    try {
      const response = await getMessageByChatId({
        chatId: chat?._id,
        userId: userId,
      });
      setMessages(response?.messages);
      setHasMore(response?.hasMore);
    } catch (error) {
      console.log(error);
    }
  };

  const loadMoreChatMessage = async (chatId, userId) => {
    if (hasMore) {
      try {
        const response = await getMessageByChatId({
          chatId,
          userId,
          limit: 15,
          skip: messages.length,
        });
        setMessages((prevMessages) => [...response.messages, ...prevMessages]);
        setHasMore(response?.hasMore);
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    if (user && chat) {
      setMessages([]);
      getChatMessage();
    }
  }, [chat, userId]);

  const sendMessageSocket = () => {
    if (!socket || !newMessage || !chat) return;

    const recipients = chat.participants?.filter(
      (participant) => participant.userId?._id !== userId
    );
    socket.emit("sendMessage", {
      message: { ...newMessage },
      recipients: recipients,
    });
    setNewMessage(null);
  };

  const createChatSocket = (chat, recipient) => {
    if (!chat || !recipient) return;
    socket?.emit("createGroup", { chat, recipient });
  };

  const receiveSocketCreateGroup = async (newChat) => {
    setChatBarChange(newChat);
    const message = `You have just been added to the conversation '${newChat?.chat_name}'`;
    const notify = await createChatNotification({
      userId: user?._id,
      message,
      refChat: newChat?._id,
    });
    setNotifications((prev) => [notify, ...prev]);
  };

  const deleteChatSocket = (chat, recipient) => {
    if (!recipient) return;
    socket?.emit("deleteGroup", { chat, recipient });
  };
  const receiveSocketDeleteGroup = async (deletedChat) => {
    setChatDeleted(deletedChat);
    const message = `The conversation '${deletedChat?.chat_name}' has been deleted`;
    const notify = await createChatNotification({
      userId: user?._id,
      message,
      refChat: deletedChat?._id,
    });
    setNotifications((prev) => [notify, ...prev]);
    toast.info("Chat deleted!");
  };
  const kickChatSocket = (chat, kickedUser, recipient) => {
    if (!recipient) return;
    socket?.emit("kickGroup", { chat, kickedUser, recipient });
  };

  const receiveSocketKickGroup = async ({ chat, kickedUser }) => {
    setKickChat({ chat, kickedUser });
    let message = "";
    if (kickedUser === user?._id && user._id !== chat?.created_by) {
      message = `You have been removed from the conversation '${chat?.chat_name}'`;
      const notify = await createChatNotification({
        userId: user?._id,
        message,
        refChat: null,
      });
      setNotifications((prev) => [notify, ...prev]);
    } else {
      message = `A member has been removed from the conversation '${chat?.chat_name}'`;
      const notify = await createChatNotification({
        userId: user._id,
        message,
        refChat: chat?._id,
      });
      setNotifications((prev) => [notify, ...prev]);
    }
  };

  const joinGroupSocket = async (userId, recipient) => {
    if (!socket || !chat) return;
    socket.emit("joinGroup", { recipient, userId });
  };

  const leaveGroupSocket = async (chat, recipient, notify) => {
    if (!socket || !chat) return;
    socket.emit("leaveGroup", { chat, recipient, notify });
  };

  const typingSocket = (user, chatId, recipient) => {
    if (!socket || !recipient) return;
    socket.emit("typing", { user, chatId, recipient });
  };

  const stopTypingSocket = (user, chatId, recipient) => {
    if (!socket || !recipient) return;
    socket.emit("stopTyping", { user, chatId, recipient });
  };

  const blockUserSocket = (chatId, recipient, notify) => {
    if (!socket || !recipient) return;
    socket.emit("blockUser", { chatId, recipient, notify });
  };

  const unBlockUserSocket = (chatId, recipient) => {
    if (!socket || !recipient) return;
    socket.emit("unblockUser", { chatId, recipient });
  };

  const micOffSocket = (user, recipient) => {
    if (!socket || !recipient) return;
    socket.emit("micOff", { user, recipient });
  };
  const micOnSocket = (user, recipient) => {
    if (!socket || !recipient) return;
    socket.emit("micOn", { user, recipient });
  };
  const cameraOffSocket = (user, recipient) => {
    if (!socket || !recipient) return;
    socket.emit("cameraOff", { user, recipient });
  };
  const cameraOnSocket = (user, recipient) => {
    if (!socket || !recipient) return;
    socket.emit("cameraOn", { user, recipient });
  };

  const sendFriendRequestSocket = async (userId, notify) => {
    if (!socket || !userId) return;
    socket.emit("sendFriendRequest", { userId, notify });
  };

  const acceptFriendRequestSocket = async (userId, notify) => {
    if (!socket || !userId) return;
    socket.emit("acceptFriendRequest", { userId, notify });
  };

  const rejectFriendRequestSocket = async (userId, notify) => {
    if (!socket || !userId) return;
    socket.emit("rejectFriendRequest", { userId, notify });
  };

  const receiveSocketJoinGroup = async ({ chat, userId }) => {
    if (userId?.some((u) => u === user?._id)) {
      setChatBarChange(chat);
      const message = `You have joined the conversation '${chat?.chat_name}'`;
      const notify = await createChatNotification({
        userId: user?._id,
        message,
        refChat: chat?._id,
      });
      setNotifications((prev) => [notify, ...prev]);
    } else {
      const message = `New users has joined the conversation '${chat?.chat_name}'`;
      const notify = await createChatNotification({
        userId: user?._id,
        message,
        refChat: chat?._id,
      });
      setNotifications((prev) => [notify, ...prev]);
    }
  };

  const reactMessageSocket = () => {
    if (!socket || !chat) return;
    const recipients = chat.participants?.filter(
      (participant) => participant.userId?._id !== userId
    );
    socket.emit("reactMessage", {
      message: { ...reactedMessage },
      recipients: recipients,
    });
  };

  const handleReadMessage = useCallback(
    async (message) => {
      await markAsRead({ messageId: message?._id, userId });

      const recipients = chat?.participants?.filter(
        (participant) => participant.userId._id !== userId
      );
      socket.emit("readMessage", { message, recipients });
    },
    [socket, chat, userId]
  );

  const handleReactMessage = useCallback(async (messageId, userId, key) => {
    try {
      const response = await reactMessage({
        messageId: messageId,
        userId: userId,
        emotion: key,
      });

      setReactedMessage(response);

      setMessages((prevMessages) =>
        prevMessages.map((msg) => (msg._id === response?._id ? response : msg))
      );
    } catch (error) {
      console.log(error);
    }
  });

  const onDeleteMessage = (messageId) => {
    setMessages((prevMessages) =>
      prevMessages?.filter((msg) => msg._id !== messageId)
    );
  };

  const handleSendMessage = useCallback(
    async (
      textMessage,
      senderId,
      chatId,
      setTextMessage,
      images,
      setImages
    ) => {
      const tempMessage = {
        sender_id: senderId,
        chatId,
        content: {
          text: textMessage,
          images: images.map((file) => URL.createObjectURL(file)),
        },
        isLoading: images.length > 0,
      };
      setMessages((prev) => [...prev, tempMessage]);
      setTextMessage("");
      setImages([]);

      const response = await sendMessage({
        senderId: senderId,
        chatId: chatId,
        text: textMessage,
        images: images,
      });

      setMessages((prev) =>
        prev.map((msg) => (msg === tempMessage ? response : msg))
      );
      setNewMessage(response);
    }
  );

  const handleSendHello = useCallback(async (senderId, chatId) => {
    const tempMessage = {
      sender_id: senderId,
      chatId,
      content: {
        text: "Hello 🙌",
      },
    };
    setMessages((prev) => [...prev, tempMessage]);

    const response = await sendMessage({
      senderId: senderId,
      chatId: chatId,
      text: "Hello 🙌",
    });

    setMessages((prev) =>
      prev.map((msg) => (msg === tempMessage ? response : msg))
    );
    setNewMessage(response);
  });

  const handleSendFile = useCallback(async (senderId, chatId, files) => {
    const tempMessage = {
      sender_id: senderId,
      chatId,
      content: {
        files: files.map((file) => URL.createObjectURL(file)),
      },
      isLoading: true,
    };
    setMessages((prev) => [...prev, tempMessage]);
    const response = await sendFile({ senderId, chatId, files }, (progress) => {
      setUploadProgress(progress);
    });
    setMessages((prev) =>
      prev.map((msg) => (msg === tempMessage ? response : msg))
    );
    setNewMessage(response);
  });

  const handleSendCallMessage = useCallback(
    async (
      senderId,
      chatId,
      callDuration,
      is_accepted,
      is_rejected,
      call_type
    ) => {
      const response = await createCallMessage({
        senderId,
        chatId,
        callDuration,
        is_accepted,
        is_rejected,
        call_type,
      });
      setMessages((prev) => [...prev, response]);
      setNewMessage(response);
    }
  );

  const handleReplyMessage = useCallback(
    async (
      textMessage,
      senderId,
      messageId,
      setTextMessage,
      images,
      setImages
    ) => {
      const tempMessage = {
        sender_id: senderId,
        content: {
          text: textMessage,
          images: images.map((file) => URL.createObjectURL(file)),
        },
        isLoading: images.length > 0,
      };
      setMessages((prev) => [...prev, tempMessage]);
      setTextMessage("");
      setImages([]);

      const response = await replyMessage({
        userId: senderId,
        messageId: messageId,
        text: textMessage,
        images: images,
      });

      setMessages((prev) =>
        prev.map((msg) => (msg === tempMessage ? response : msg))
      );
      setNewMessage(response);
    }
  );

  const handleRemoveMessage = useCallback(
    async (userId, messageId) => {
      try {
        const response = await removeMessage({ messageId, userId });
        setMessages((prev) =>
          prev.map((msg) => (msg._id === messageId ? response : msg))
        );
        const recipients = chat?.participants?.filter(
          (participant) => participant.userId?._id !== userId
        );
        socket.emit("removeMessage", { message: response, recipients });
      } catch (error) {
        console.log(error);
      }
    },
    [chat]
  );

  useEffect(() => {
    const listUnread = notifications?.filter(
      (notification) => !notification?.seen
    );
    setCountUnreadNotifications(listUnread?.length);
  }, [notifications]);

  useEffect(() => {
    const images = messages?.flatMap(
      (message) => message?.content?.image || []
    );
    setChatLibrary(images);
  }, [messages]);

  useEffect(() => {
    if (socket === null) console.log("socket is null");

    socket?.on("receiveMessage", (message) => {
      if (chat?._id !== message?.chat_id) {
        setReceiveMessage((prev) => prev + 1);
        return;
      }
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    socket?.on("groupCreated", (newChat) => {
      receiveSocketCreateGroup(newChat);
    });

    socket?.on("groupDeleted", (deletedChat) => {
      receiveSocketDeleteGroup(deletedChat);
    });

    socket?.on("receiveReact", (updatedMessage) => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg._id === updatedMessage?._id ? updatedMessage : msg
        )
      );
    });

    socket?.on("groupKicked", ({ chat, kickedUser }) => {
      receiveSocketKickGroup({ chat, kickedUser });
    });

    socket?.on("groupJoined", ({ chat, userId }) => {
      receiveSocketJoinGroup({ chat, userId });
    });

    socket?.on("groupLeft", ({ notify }) => {
      setNotifications((prev) => [notify, ...prev]);
    });

    socket?.on("receiveRead", (message) => {
      if (chat?._id !== message?.chat_id) return;

      setMessages((prevMessages) =>
        prevMessages?.map((msg) => (msg?._id === message?._id ? message : msg))
      );
    });

    socket?.on("receiveRemove", (message) => {
      setMessages((prevMessages) =>
        prevMessages?.map((msg) => (msg?._id === message?._id ? message : msg))
      );
    });

    socket?.on("receiveFriendRequest", (notify) => {
      setNotifications((prev) => [notify, ...prev]);
    });

    socket?.on("receiveFriendAccept", (notify) => {
      setNotifications((prev) => [notify, ...prev]);
    });

    socket?.on("receiveFriendReject", (notify) => {
      setNotifications((prev) => [notify, ...prev]);
    });

    socket?.on("receiveTyping", (res) => {
      setTyping((prev) => {
        const existingIndex = prev.findIndex(
          (item) =>
            item.user?._id === res.user?._id && item.chatId === res.chatId
        );

        if (existingIndex !== -1) {
          const updatedTyping = [...prev];
          updatedTyping.splice(existingIndex, 1);
          return [res, ...updatedTyping];
        } else {
          return [res, ...prev];
        }
      });
    });

    socket?.on("receiveStopTyping", (res) => {
      const { user, chatId } = res;

      setTyping((prevTyping) =>
        prevTyping.filter(
          (t) => !(t.user?._id === user._id && t.chatId === chatId)
        )
      );
    });

    socket?.on("receiveBlocked", (res) => {
      const { chatId, notify } = res;
      setNotifications((prev) => [notify, ...prev]);
      setBlockedChat(chatId);
    });

    socket?.on("receiveUnblocked", (chatId) => {
      setBlockedChat(null);
    });

    socket?.on("receiveMicOff", (user) => {
      setMicOff(user);
    });
    socket?.on("receiveMicOn", (user) => {
      setMicOff(null);
    });

    socket?.on("receiveCameraOff", (user) => {
      setCameraOff(user);
    });
    socket?.on("receiveCameraOn", (user) => {
      setCameraOff(null);
    });

    return () => {
      socket?.off("receiveMessage");
      socket?.off("receiveReact");
      socket?.off("receiveRead");
      socket?.off("receiveRemove");
      socket?.off("groupCreated");
      socket?.off("groupDeleted");
      socket?.off("groupKicked");
      socket?.off("receiveFriendReject");
      socket?.off("receiveFriendAccept");
      socket?.off("receiveFriendRequest");
      socket?.off("receiveTyping");
      socket?.off("receiveStopTyping");
      socket?.off("receiveMicOff");
      socket?.off("receiveMicOn");
      socket?.off("receiveCameraOff");
      socket?.off("receiveCameraOn");
      socket?.off("receiveBlocked");
      socket?.off("receiveUnblocked");
    };
  }, [socket, chat]);

  useEffect(() => {
    reactMessageSocket();
  }, [reactedMessage]);

  useEffect(() => {
    sendMessageSocket();
  }, [newMessage]);

  useEffect(() => {
    const getUserNotifications = async () => {
      const response = await getNotificationByUserId({ userId: user?._id });
      setNotifications(response);
    };
    if (user) {
      getUserNotifications();
    }
  }, [user]);

  return (
    <SocketContext.Provider
      value={{
        socket,
        onlineUsers,
        newMessage,
        messages,
        reactedMessage,
        receiveMessage,
        setReactedMessage,
        setMessages,
        setNewMessage,
        handleSendMessage,
        handleReplyMessage,
        handleReadMessage,
        handleReactMessage,
        uploadProgress,
        handleRemoveMessage,
        handleSendFile,
        onDeleteMessage,
        handleSendCallMessage,
        createChatSocket,
        chatBarChange,
        deleteChatSocket,
        chatDeleted,
        receiveSocketDeleteGroup,
        kickChatSocket,
        kickChat,
        notifications,
        setNotifications,
        joinGroupSocket,
        handleSendHello,
        rejectFriendRequestSocket,
        acceptFriendRequestSocket,
        sendFriendRequestSocket,
        typingSocket,
        stopTypingSocket,
        micOffSocket,
        micOnSocket,
        cameraOffSocket,
        cameraOnSocket,
        typing,
        cameraOff,
        micOff,
        setCameraOff,
        setMicOff,
        countUnreadNotifications,
        chatLibrary,
        loadMoreChatMessage,
        hasMore,
        blockUserSocket,
        blockedChat,
        unBlockUserSocket,
        leaveGroupSocket,
        chatLeaved,
        leaveChatEvent
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
