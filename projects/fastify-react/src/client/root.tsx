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