import React, { useState, useEffect } from 'react';
import './style/Login.css';

const EditModal = React.memo(({ user, onSave, onCancel, availableProfessions = [] }) => {
  const [editedData, setEditedData] = useState({
    firstName: user.first_name,
    lastName: user.last_name,
    username: user.username,
    phone: user.phone,
    email: user.email,
    password: '',
  });

  const [newRole, setNewRole] = useState(user.role_id || availableProfessions[0]?.id);
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    username: '',
    phone: '',
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setEditedData({
      firstName: user.first_name,
      lastName: user.last_name,
      username: user.username,
      phone: user.phone,
      email: user.email,
      password: user.password,
    });
  }, [user]);

  const validateInputs = () => {
    const newErrors = {};
  
    // First Name
    if (!/^[a-zA-Z]+$/.test(editedData.firstName.trim()) || editedData.firstName.length > 14) {
      newErrors.firstName = 'First Name should contain only letters and be at most 14 characters long';
    }
  
    // Last Name
    if (!/^[a-zA-Z]+$/.test(editedData.lastName.trim()) || editedData.lastName.length > 14) {
      newErrors.lastName = 'Last Name should contain only letters and be at most 14 characters long';
    }
  
    // Phone
    if (!/^\d+$/.test(editedData.phone) || editedData.phone.length > 11) {
      newErrors.phone = 'Phone should contain only numeric values and be at most 11 digits long';
    }
  
    // Email
    if (!/\S+@\S+\.\S+/.test(editedData.email)) {
      newErrors.email = 'Email is not valid';
    }
  
    // Password
    if (editedData.password.length < 6) {
      newErrors.password = 'Password should be at least 6 characters long';
    }
  
    console.log('Validation Errors:', newErrors);
  
    setErrors(newErrors);
  
    return Object.keys(newErrors).length === 0;
  };
  
  
  

  const checkEmailExists = async (email) => {
    const response = await fetch('http://localhost:8888/api/updateUser.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        checkEmail: true,
        email,
      }),
    });
    const data = await response.json();
    return data.exists;
  };
  
  const checkPhoneExists = async (phone) => {
    const response = await fetch('http://localhost:8888/api/updateUser.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        checkPhone: true,
        phone,
      }),
    });
    const data = await response.json();
    return data.exists;
  };
  

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;

    if (type === 'number' && isNaN(value)) {
      return;
    }

    setEditedData((prevData) => ({ ...prevData, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
  
      // Validate inputs
      const isValid = validateInputs();
  
      if (!isValid) {
        console.log('Validation failed');
        return;
      }
  
      // Check email existence
      const emailExists = await checkEmailExists(editedData.email);
  
      if (emailExists) {
        console.log('Email already exists');
        return;
      }
  
      // Check phone existence
      const phoneExists = await checkPhoneExists(editedData.phone);
  
      if (phoneExists) {
        console.log('Phone number already exists');
        return;
      }
  
      // Proceed with saving
      const requestBody = JSON.stringify({
        userId: user.id,
        updatedFields: editedData,
        newRole: newRole,
      });
  
      console.log('Request Payload:', requestBody);
  
      const response = await fetch('http://localhost:8888/api/updateUser.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: requestBody,
      });
  
      // Rest of the code remains the same
  
    } catch (error) {
      console.error('Error during save:', error);
    } finally {
      setLoading(false);
    }
  };
  
  

  return (
    <div className='edit-modal'>
      <div className="new-user-top">
        <h2 className='edit-user-h2'>Edit User Profile Details</h2>
      </div>
      <div className="new-user-main">
        {/* First Name */}
        <div className="new-user-text-input">First Name</div>
        <input className='new-user-input' type='text' name='firstName' value={editedData.firstName} onChange={handleInputChange} />
        {errors.firstName && <div className="error-message">{errors.firstName}</div>}

        {/* Last Name */}
        <div className="new-user-text-input">Last Name</div>
        <input className='new-user-input' type='text' name='lastName' value={editedData.lastName} onChange={handleInputChange} />
        {errors.lastName && <div className="error-message">{errors.lastName}</div>}

        {/* Username */}
        <div className="new-user-text-input">Username</div>
        <input className='new-user-input' type='text' name='username' value={editedData.username} onChange={handleInputChange} />
        {errors.username && <div className="error-message">{errors.username}</div>}

        {/* Phone */}
        <div className="new-user-text-input">Phone</div>
        <input className='new-user-input' type='text' name='phone' value={editedData.phone} onChange={handleInputChange} />
        {errors.phone && <div className="error-message">{errors.phone}</div>}

        {/* Email */}
        <div className="new-user-text-input">Email</div>
        <input className='new-user-input' type='text' name='email' value={editedData.email} onChange={handleInputChange} />
        {errors.email && <div className="error-message">{errors.email}</div>}

        {/* Password */}
        <div className="new-user-text-input">Password</div>
        <input className='new-user-input' type='password' name='password' value={editedData.password} onChange={handleInputChange} />
        {errors.password && <div className="error-message">{errors.password}</div>}
        <div>
          <div className='edit-save-button'>
            <button className='click-save-button' onClick={handleSave} disabled={loading}>
              <span className="underline-text">{loading ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
          <div className='edit-save-button'>
            <button className='click-save-button' onClick={onCancel} disabled={loading}>
              <span className="underline-text">Cancel</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

export default EditModal;
