import React from 'react'
import LoginForm from './LoginForm'

const Login: React.FC = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h1>User Login</h1>
      <LoginForm />
    </div>
  )
}

export default Login