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

import React from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/auth';
import './home.css';

const Home = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  return (
    <div className="home-container">
      {isAuthenticated ? (
        <h1>👋 Hello {user?.username}!</h1>
      ) : (
        <h1>🛍️🛍️🛍️ Welcome to Shopping Mart !</h1>
      )}
      <button 
        className="home-go-products-link"
        onClick={() => navigate('/products')}
      >
        Browse Products
      </button>
      
      {isAuthenticated && (
        <div className="user-links-container">
          <button 
            className="home-go-wish-list"
            onClick={() => navigate('/wishlist')}
          >
            My Wishlist
          </button>
        </div>
      )}
      
      {user?.role === 'admin' && (
        <div className="admin-links-container">
          <button 
            className="home-go-product-portal-link"
            onClick={() => navigate('/admin/products')}
          >
            Product Management
          </button>
          <button 
            className="home-go-user-portal-link"
            onClick={() => navigate('/admin/users')}
          >
            User Management
          </button>
          <button 
            className="home-go-order-portal-link"
            onClick={() => navigate('/admin/orders')}
          >
            Order Management
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;