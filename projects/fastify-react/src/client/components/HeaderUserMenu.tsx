import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/auth';
import './HeaderUserMenu.css';

const HeaderUserMenu = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    setIsDropdownOpen(false);
    navigate('/');
  };

  const handleProfileClick = () => {
    setIsDropdownOpen(false);
    navigate(`/profile/${user?.username}`);
  };

  const handleOrdersClick = () => {
    setIsDropdownOpen(false);
    navigate('/orders');
  };

  return (
    <div className="header-user-menu">
      {isAuthenticated ? (
        <div className="header-user-container">
          <div 
            className="header-username"
            onMouseEnter={() => setIsDropdownOpen(true)}
            onMouseLeave={() => setIsDropdownOpen(false)}
          >
            {user?.username}
            {isDropdownOpen && (
              <div className="header-dropdown-menu">
                <button 
                  className="header-go-user-profile"
                  onClick={handleProfileClick}
                >
                  My Profile
                </button>
                <button 
                  className="header-go-to-my-orders"
                  onClick={handleOrdersClick}
                >
                  My Orders
                </button>
                <button 
                  className="header-logout-btn"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <button 
          className="header-go-login"
          onClick={() => navigate('/login')}
        >
          Login
        </button>
      )}
    </div>
  );
};

export default HeaderUserMenu;