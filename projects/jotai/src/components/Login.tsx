import React, { useState } from 'react'
import LoginForm from './LoginForm'

const Login: React.FC = () => {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: 'calc(100vh - 60px)',
      flexDirection: 'column'
    }}>
      <h1>User Login</h1>
      <LoginForm />
    </div>
  )
}

export default Login