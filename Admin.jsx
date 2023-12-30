import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

function Admin() {
  // Assuming you have some logic to determine if the user is authenticated
  const isAuthenticated = true; // Replace with your actual authentication logic

  // Initialize the navigate function using the useNavigate hook
  const navigate = useNavigate();

  return (
    <div className='admin-main'>
      <div className='admin-box-one'>
        <div className="admin-center-box">
          <div className="admin-top">Admin</div>

          <div className="admin-information">
            <ProtectedRoute role={1} isAuthenticated={isAuthenticated}>
              <div className="admin-info-box" onClick={() => navigate('/users')}>
                <div className="admin-icon-box"></div>
                <div className='admin-text-box'>Lietotāji</div>
              </div>
            </ProtectedRoute>

            <ProtectedRoute role={1} isAuthenticated={isAuthenticated}>
              <div className="admin-info-box" onClick={() => navigate('/Newuser')}>
                <div className="admin-icon-box2"></div>
                <div className='admin-text-box'>Jauns lietotājs</div>
              </div>
            </ProtectedRoute>

            <div className="admin-info-box" onClick={() => navigate('/incoming-items-page')}>
              <div className="admin-icon-box1"></div>
              <div className='admin-text-box'>Ienākošās preces</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admin;
