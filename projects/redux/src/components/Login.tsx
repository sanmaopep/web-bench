import React, { useState } from 'react';
import LoginForm from './LoginForm';

const Login: React.FC = () => {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>User Login</h1>
      <LoginForm />
    </div>
  );
};

export default Login;