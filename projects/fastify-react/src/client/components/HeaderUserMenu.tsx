// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//     http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

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