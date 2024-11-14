"use client";
import {
  getMessageByChatId,
  markAsRead,
  reactMessage,
  sendMessage,
} from "@/utils/services/messageService/message.service";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children, userId }) => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState(null);
  const [receiveMessage, setReceiveMessage] = useState(0);
  const [reactedMessage, setReactedMessage] = useState(null);
  const chat = useSelector((state) => state.chat.chatData);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    if (!userId) return;

    if (!socket) {
      const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_SERVER);
      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    } else return;
  }, [userId]);

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

  const getChatMessage = async () => {
    try {
      const response = await getMessageByChatId({
        chatId: chat?._id,
        userId: userId,
      });
      setMessages(response);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getChatMessage();
  }, [chat, userId]);

  const sendMessageSocket = () => {
    if (!socket || !newMessage || !chat) return;

    const recipients = chat.participants?.filter(
      (participant) => participant.userId !== userId
    );
    socket.emit("sendMessage", {
      message: { ...newMessage },
      recipients: recipients,
    });
    setNewMessage(null);
  };

  const reactMessageSocket = () => {
    if (!socket || !chat) return;
    const recipients = chat.participants?.filter(
      (participant) => participant.userId !== userId
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
        (participant) => participant.userId !== userId
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
        prevMessages.map((msg) => (msg._id === response._id ? response : msg))
      );
    } catch (error) {
      console.log(error);
    }
  });

  const handleSendMessage = useCallback(
    async (
      textMessage,
      senderId,
      chatId,
      setTextMessage,
      images,
      setImages
    ) => {
      const response = await sendMessage({
        senderId: senderId,
        chatId: chatId,
        text: textMessage,
        images: images,
      });

      setNewMessage(response);
      setMessages((prev) => [...prev, response]);
      setTextMessage("");
      setImages([]);
    }
  );

  useEffect(() => {
    if (socket === null) console.log("socket is null");
    socket?.on("receiveMessage", (message) => {
      if (chat?._id !== message?.chat_id) {
        setReceiveMessage((prev) => prev + 1);
        return;
      };
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    socket?.on("receiveReact", (updatedMessage) => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg._id === updatedMessage._id ? updatedMessage : msg
        )
      );
    });

    socket?.on("receiveRead", (message) => {
      if (chat?._id !== message?.chat_id) return;
      
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg._id === message._id ? message : msg
        )
      );
    });

    return () => {
      socket?.off("receiveMessage");
      socket?.off("receiveReact");
      socket?.off("receiveRead");
    };
  }, [socket, chat]);

  useEffect(() => {
    reactMessageSocket();
  }, [reactedMessage]);

  useEffect(() => {
    sendMessageSocket();
  }, [newMessage]);

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
        handleReadMessage,
        handleReactMessage,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
