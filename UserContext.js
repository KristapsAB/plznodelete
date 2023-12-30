// UserContext.js
import React, { createContext, useState, useEffect } from 'react';

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState({
    userId: '',
    username: '',
    role: '',
  });

  useEffect(() => {
    // Check local storage for user data
    const storedUserId = localStorage.getItem('userId');
    const storedUsername = localStorage.getItem('username');
    const storedUserRole = localStorage.getItem('role');

    // Update context based on local storage
    if (storedUserId && storedUsername && storedUserRole) {
      setUserData({
        userId: storedUserId,
        username: storedUsername,
        role: storedUserRole,
      });
      setIsAuthenticated(true);
    }
  }, []);

  const setAuthStatus = (status) => {
    setIsAuthenticated(status);
  };

  return (
    <UserContext.Provider value={{ isAuthenticated, setAuthStatus, userData }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
