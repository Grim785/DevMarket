import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Kết nối Socket.IO
    const newSocket = io('http://localhost:4000'); // server port
    setSocket(newSocket);

    newSocket.on('connect', () =>
      console.log('✅ Connected to Socket.IO server')
    );
    newSocket.on('disconnect', () =>
      console.log('❌ Disconnected from Socket.IO server')
    );

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
