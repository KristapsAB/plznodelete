import React, { useState } from 'react';
import './style/Login.css';

function Newuser() {
  const [userData, setUserData] = useState({
    username: '',
    password: '',
    profession: '', // Default to an empty string
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
  });

  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
    setError(null); // Clear previous errors when the user starts typing
  };

  const handleAddUser = () => {
    // Send user data to the backend API
    fetch('http://localhost:8888/api/insertions.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          // Successful insertion, reset form and show success message
          setUserData({
            username: '',
            password: '',
            profession: '', // Reset profession to an empty string
            firstName: '',
            lastName: '',
            phone: '',
            email: '',
          });
          setError(null);
          console.log('User added successfully');
        } else {
          // Handle and display errors
          setError(data.message);
          console.error('Error adding user:', data.message);
        }
      })
      .catch(error => {
        // Handle network errors
        setError('An error occurred. Please try again later.');
        console.error('Error:', error);
      });
  };

  return (
    <div className='new-user-body'>
      <div className="new-user-top">
        <h1 className='new-user-h1'>Jauns Lietotājs</h1>
      </div>
      <div className="new-user-main">
        <div className="new-user-text-input">Lietotājvārds</div>
        <input
          className='new-user-input'
          name='username'
          value={userData.username}
          onChange={handleInputChange}
        />
        <div className="new-user-text-input">Parole</div>
        <input
          className='new-user-input'
          name='password'
          type='password'
          value={userData.password}
          onChange={handleInputChange}
        />
        <div className="new-user-text-input">Profesija</div>
        <div className="custom-dropdown">
          <select
            className='new-user-input'
            name='profession'
            value={userData.profession}
            onChange={handleInputChange}
          >
            <option value="">Select Profession</option>
            <option value="1">Admin</option>
            <option value="2">Noliktavas Darbinieks</option>
            <option value="3">Plauktu kartotajs</option>
          </select>
          <div className="dropdown-arrow">&#9660;</div>
        </div>
        <div className="new-user-text-input">Vārds</div>
        <input
          className='new-user-input'
          name='firstName'
          value={userData.firstName}
          onChange={handleInputChange}
        />
        <div className="new-user-text-input">Uzvārds</div>
        <input
          className='new-user-input'
          name='lastName'
          value={userData.lastName}
          onChange={handleInputChange}
        />
        <div className="new-user-text-input">Telefona Numurs</div>
        <input
          className='new-user-input'
          name='phone'
          value={userData.phone}
          onChange={handleInputChange}
          maxLength={12} // Set the maximum length to 12 characters
        />
        <div className="new-user-text-input">Epasts</div>
        <input
          className='new-user-input'
          name='email'
          type='email'
          value={userData.email}
          onChange={handleInputChange}
        />
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        <div className='new-user-button'>
          <button className='new-user-button-style' onClick={handleAddUser}>
            Pievienot
          </button>
        </div>
      </div>
    </div>
  );
}

export default Newuser;
