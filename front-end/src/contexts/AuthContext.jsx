// src/contexts/AuthContext.jsx
import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem('user')) || null
  );

  useEffect(() => {
    localStorage.setItem('token', token);
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ token, setToken, user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
