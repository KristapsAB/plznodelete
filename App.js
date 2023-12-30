// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './Login';
import Admin from './Admin';
import Newuser from './Newuser';
import User from './Users';
import { UserProvider } from './UserContext';
import ProtectedRoute from './ProtectedRoute';

function App() {
  return (
    <Router>
      <UserProvider>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/admin/*"  // Add the trailing "*" for nested routes
              element={
                <ProtectedRoute role={1}>
                  <Admin />
                </ProtectedRoute>
              }
            />
            <Route
              path="/newuser"
              element={
                <ProtectedRoute role={1}>
                  <Newuser />
                </ProtectedRoute>
              }
            />
            <Route
              path="/users"
              element={
                <ProtectedRoute role={1}>
                  <User />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </UserProvider>
    </Router>
  );
}

export default App;
