import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from './UserContext';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const { setAuthStatus } = useContext(UserContext);

  const handleLogin = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch('http://localhost:8888/api/api.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
  
      const responseData = await response.json();
  
      if (!response.ok || typeof responseData.role !== 'number') {
        // Invalid credentials or other error
        console.error('Error during login:', responseData.message);
        setErrorMessage(responseData.message || 'An error occurred during login');
        return;
      }
  
      // Successful login
      console.log('User Role:', responseData.role);
  
      // Update UserContext with authentication status
      setAuthStatus(true);
  
      // Store user information in local storage
      localStorage.setItem('userId', responseData.userId);
      localStorage.setItem('username', responseData.username);
      localStorage.setItem('role', responseData.role);
  
      // Redirect based on the user's role
      if (responseData.role === 1) {
        console.log('User Role is Admin');
        navigate('/admin'); // Navigate to the admin page
      } else {
        console.log('User Role is not Admin');
        navigate('/home'); // Navigate to the home page
      }
    } catch (error) {
      console.error('Error during login:', error);
      setErrorMessage('An error occurred during login');
    }
  };
  
  return (
    <div className="login-main">
      <div className="login-center">
        <div className="login-image"></div>
        <div className="loginTOP">
          <div className="login-logo"></div>
          <div className="login-title">
            <h1 className="register-h1">LOGIN</h1>
          </div>
          <form className="login-form" onSubmit={handleLogin}>
            <div className="inputFI">
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="inputFI2">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="error-message">{errorMessage}</div>
            <div className="buttonss">
              <button type="submit" className="button1">
                LOGIN
              </button>
            </div>
            <div className="loginB"></div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
