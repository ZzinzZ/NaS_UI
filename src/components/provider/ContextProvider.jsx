"use client"
import React from 'react';
import { SocketProvider } from '@/contexts/SocketContext';
import { useSelector } from 'react-redux';

const ContextProvider = ({children}) => {
    const {user} = useSelector(state => state.auth);
  return (
    <SocketProvider userId={user?._id}>
        {children}
    </SocketProvider>
  )
}

export default ContextProvider