import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext(null);
export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  // Lấy URL socket từ env
  const SOCKET_BASE = import.meta.env.VITE_SOCKET_URL;

  useEffect(() => {
    if (!SOCKET_BASE) {
      console.error('❌ VITE_SOCKET_URL chưa được cấu hình trong .env');
      return;
    }

    // Kết nối Socket.IO
    const newSocket = io(SOCKET_BASE, {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      transports: ['websocket'],
    });

    setSocket(newSocket);

    newSocket.on('connect', () => {
      if (import.meta.env.VITE_ENV !== 'production') {
        console.log('✅ Connected to Socket.IO server');
      }
    });

    newSocket.on('disconnect', () => {
      if (import.meta.env.VITE_ENV !== 'production') {
        console.log('❌ Disconnected from Socket.IO server');
      }
    });

    // Cleanup khi unmount
    return () => {
      newSocket.disconnect();
    };
  }, [SOCKET_BASE]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
