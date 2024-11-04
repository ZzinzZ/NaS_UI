import { io } from "socket.io-client";

let socket;

export const initiateSocketConnection = (userId) => {
    socket = io(process.env.NEXT_PUBLIC_SOCKET_SERVER);
    console.log('Connecting socket...');
    socket.emit('user_online', userId);
};

export const subscribeToOnlineStatus = (callback) => {
    if (!socket) return;
    socket.on('user_online_status', ({ userId, isOnline }) => {
        console.log(`${userId} is ${isOnline ? 'online' : 'offline'}`);
        callback(userId, isOnline);  
    });
};

export const disconnectSocket = (userId) => {
    if (socket) {
        socket.emit('user_offline', userId);
        socket.disconnect();
    }
    console.log('Disconnected from socket...');
};

export const handleDisconnect = () => {
    disconnectSocket();
    socket.emit('user_offline');
};