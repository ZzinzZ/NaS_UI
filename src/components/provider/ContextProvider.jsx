"use client";
import React from "react";
import { SocketProvider } from "@/contexts/SocketContext";
import { useSelector } from "react-redux";
import { StringeeProvider } from "@/contexts/StringeeContext";

const ContextProvider = ({ children }) => {
  const { user } = useSelector((state) => state.auth);
  return (
      <StringeeProvider>
        <SocketProvider userId={user?._id}>{children}</SocketProvider>
      </StringeeProvider>
  );
};

export default ContextProvider;
