import React, { useEffect, useState, useCallback } from 'react';
import './style/Login.css';
import EditModal from './EditModal';
import { FaSearch, FaEdit } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const User = () => {
  const [loggedInUserRole, setLoggedInUserRole] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userCount, setUserCount] = useState(0);
  const [availableProfessions] = useState([
    { id: 1, name: 'Admin' },
    { id: 2, name: 'Noliktavas darbinieks' },
    { id: 3, name: 'Plauktu Kārtotājs' },
  ]);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [fetchError, setFetchError] = useState(null);

  const navigate = useNavigate();

  const debounce = (func, delay) => {
    let timeoutId;
    return function (...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  const fetchUserRole = async () => {
    try {
      const response = await fetch('http://localhost:8888/api/api.php');
      const data = await response.json();

      if (data.success) {
        setLoggedInUserRole(data.role);
      } else {
        console.error('Error fetching user role:', data.message);
        // Handle the case where user role is not available
      }
    } catch (error) {
      console.error('Error:', error);
      // Handle the case where user role is not available
    }
  };

  const fetchUsers = async (query = '') => {
    try {
      let apiUrl = 'http://localhost:8888/api/getUsers.php';
      let requestOptions = {};

      if (query) {
        apiUrl = 'http://localhost:8888/api/searchUsers.php';
        requestOptions = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            searchQuery: query,
          }),
        };
      }

      const response = await fetch(apiUrl, requestOptions);
      const data = await response.json();

      if (data.success) {
        setUsers(data.users);
        setFetchError(null);
      } else {
        setFetchError('Error fetching users. Please try again.');
      }
    } catch (error) {
      setFetchError('An unexpected error occurred. Please try again.');
    }
  };

  const fetchUserCount = async () => {
    try {
      const response = await fetch('http://localhost:8888/api/getUserCount.php');
      const data = await response.json();

      if (data.success) {
        setUserCount(data.count);
      } else {
        // Handle the case where user count is not available
      }
    } catch (error) {
      // Handle the case where user count is not available
    }
  };

  const handlePromoteDemote = async (userId, newProfession) => {
    try {
      const response = await fetch('http://localhost:8888/api/promoteDemoteUser.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          action: 'promote',
          newProfession: newProfession,
        }),
      });
      const data = await response.json();

      if (data.success) {
        fetchUsers(searchQuery);
        setSelectedUser(null);
      } else {
        // Handle the case where promoting/demoting user fails
      }
    } catch (error) {
      // Handle the case where an error occurs
    }
  };

  const handleAtlaist = async () => {
    if (!selectedUser) {
      return;
    }

    try {
      const response = await fetch('http://localhost:8888/api/atlaistUser.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: selectedUser.id,
        }),
      });
      const data = await response.json();

      if (data.success) {
        fetchUsers(searchQuery);
        setSelectedUser(null);
      } else {
        // Handle the case where dismissing user fails
      }
    } catch (error) {
      // Handle the case where an error occurs
    }
  };

  const handleEdit = () => {
    if (!selectedUser) {
      return;
    }

    setEditModalVisible(true);
  };

  const handleEditModalSave = async (editedData) => {
    const { id, roleChanged, newRole, ...restData } = editedData;

    if (Object.keys(restData).length === 0 && !roleChanged) {
      console.error('No fields were edited');
      return;
    }

    try {
      const response = await fetch('http://localhost:8888/api/updateUser.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: selectedUser.id,
          updatedFields: restData,
          ...(roleChanged && { newRole: newRole }),
        }),
      });

      const data = await response.json();

      if (data.success) {
        setUsers((prevUsers) => {
          const updatedUsers = prevUsers.map((user) =>
            user.id === selectedUser.id ? { ...user, ...restData } : user
          );
          return updatedUsers;
        });

        setEditModalVisible(false);
        setSelectedUser(null);
      } else {
        // Handle the case where updating user data fails

        if (data.errors) {
          alert('Validation errors:\n' + Object.values(data.errors).join('\n'));
        }
      }
    } catch (error) {
      // Handle the case where an error occurs
    }
  };

  const handleSaveChanges = async () => {
    try {
      // Placeholder for saving changes (to be implemented)
    } catch (error) {
      // Handle the case where an error occurs
    }
  };

  useEffect(() => {
    fetchUserRole(); // Fetch user role
    fetchUsers();
    fetchUserCount();
  }, []);

  const debouncedFetchUsers = useCallback(
    debounce(() => {
      fetchUsers(searchQuery);
    }, 300),
    [searchQuery]
  );

  useEffect(() => {
    debouncedFetchUsers();
  }, [debouncedFetchUsers]);

  if (loggedInUserRole === null) {
    return <div>Loading...</div>; // Loading state while waiting for user role information
  }

  if (loggedInUserRole !== 'Admin') {
    return (
      <div className='User-main'>
        <h1>You do not have permission to access this page.</h1>
      </div>
    );
  }

  return (
    <div className='User-main'>
      <div className='user-text'>
        <h1 className='user-lietotaji'>User Management</h1>
        {fetchError && (
          <div className="error-message">
            {fetchError}
          </div>
        )}
        <div className='user-search-bar-container'>
          <input
            type='text'
            placeholder='Search users...'
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
            }}
            className='user-search-bar-input'
          />
          <div className='search-icon'>
            <FaSearch />
          </div>
        </div>
      </div>
      <div className='user-roles-container'>
        <div className='user-roles-inside'>
          <h2 className='user-roles-text'>Name</h2>
        </div>
        <div className='user-roles-inside'>
          <h2 className='user-roles-text'>Role</h2>
        </div>
        <div className='user-roles-inside1'>
          <h2 className='user-roles-text'>Actions</h2>
        </div>
      </div>
      <div className='user-counter'>Showing {userCount} Users</div>
      <div className='user-center'>
        {users
          .filter((user) =>
            user.first_name.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map((user) => (
            <div
              key={user.id}
              className={`user-center-info-container ${
                selectedUser === user ? 'selected-user' : ''
              }`}
              onClick={() => setSelectedUser(user)}
            >
              <div className='user-name'>
                <div className='user-info'>
                  <div>{user.first_name}</div>
                </div>
                <div className='user-info'>
                  <div className='user-info user-last-name'>{user.last_name}</div>
                </div>
              </div>
              <div className='user-name'>
                <div className="user-custom-dropdown">
                  <select
                    className='user-dropdown'
                    value={user.role_id || ''}
                    onChange={(e) => {
                      if (loggedInUserRole === 'Admin') {
                        handlePromoteDemote(user.id, e.target.value);
                      } else {
                        // Handle the case where user does not have permission to change roles
                      }
                    }}
                  >
                    {availableProfessions.map((profession) => (
                      <option key={profession.id} value={profession.id}>
                        {profession.name}
                      </option>
                    ))}
                  </select>
                  <div className="dropdown-arrow1">&#9660;</div>
                </div>
              </div>
              <div className='user-name'>
                <button
                  className='user-button settings-icon'
                  onClick={handleAtlaist}
                >
                  Remove User
                </button>
              </div>
              <div className='user-name'>
                <button
                  className='user-button-edit'
                  onClick={handleEdit}
                >
                  <FaEdit /> Modify Data
                </button>
              </div>
            </div>
          ))}
      </div>
      <div className='user-button-saglabat'>
        <button className='user-button-save' onClick={handleSaveChanges}>
          SAGLABĀT
        </button>
      </div>
      {editModalVisible && (
        <EditModal
          user={selectedUser}
          onSave={handleEditModalSave}
          onCancel={() => setEditModalVisible(false)}
        />
      )}
    </div>
  );
};

export default User;
