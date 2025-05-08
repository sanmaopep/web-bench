import React, { useState } from 'react'
import useUserStore from '../stores/user'
import { navigate } from '../stores/route'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const login = useUserStore((state) => state.login)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (!username || !password) {
      setError('Username and password are required')
      return
    }
    
    const success = await login(username, password)
    if (success) {
      navigate('/')
    } else {
      setError('Invalid username or password')
    }
  }

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      height: 'calc(100vh - 60px)'
    }}>
      <div style={{
        width: '400px',
        padding: '20px',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h1>User Login</h1>
        {error && (
          <div style={{ color: 'red', marginBottom: '16px' }}>{error}</div>
        )}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label htmlFor="username" style={{ display: 'block', marginBottom: '8px' }}>Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #ccc'
              }}
            />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label htmlFor="password" style={{ display: 'block', marginBottom: '8px' }}>Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #ccc'
              }}
            />
          </div>
          <button
            type="submit"
            className="login-submit-btn"
            style={{
              backgroundColor: '#2196f3',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '4px',
              cursor: 'pointer',
              width: '100%'
            }}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login