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
import { Outlet, useNavigate } from 'react-router';
import './root.css';
import HeaderUserMenu from './components/HeaderUserMenu';
import Cart from './components/Cart';

const RootLayout = () => {
  const navigate = useNavigate();

  return (
    <div className="app-container">
      <header className="site-header">
        <h1 onClick={() => navigate('/')} className="site-title">🛍️ WebBench Shopping Mart</h1>
        <HeaderUserMenu />
      </header>
      <main className="site-main">
        <Outlet />
      </main>
      <Cart />
      <footer className="site-footer">
        <p>Copyright: Web Bench</p>
      </footer>
    </div>
  );
};

export default RootLayout;