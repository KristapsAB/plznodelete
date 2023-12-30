// ProtectedRoute.js
import React, { useContext } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { UserContext } from './UserContext';

function ProtectedRoute({ role, children }) {
  const { isAuthenticated } = useContext(UserContext);
  console.log('Checking Protected Route. Role:', role, 'IsAuthenticated:', isAuthenticated);

  // Retrieve user data from localStorage
  const storedUserId = localStorage.getItem('userId');
  const storedUsername = localStorage.getItem('username');
  const storedUserRole = localStorage.getItem('role');

  console.log('User data in local storage:', storedUserId, storedUsername, storedUserRole);

  // Check if the user is authenticated and user data exists
  if (!isAuthenticated || !storedUserId || !storedUsername || !storedUserRole) {
    console.log('User is not authenticated. Redirecting to login.');
    return <Navigate to="/login" />;
  }

  const userData = {
    userId: storedUserId,
    username: storedUsername,
    role: storedUserRole,
  };

  console.log('User data:', userData);

  // Check if the user has the required role
  if (parseInt(userData.role, 10) !== role) {
    console.log('User does not have the required role. Redirecting to login.');
    return <Navigate to="/login" />;
  }

  console.log('User has the required role.');

  // Use a Routes component to wrap the Route and children
  return (
    <Routes>
      <Route path="/" element={children} />
    </Routes>
  );
}

export default ProtectedRoute;
