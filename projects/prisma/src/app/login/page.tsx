'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import './login.css'
import { useAuth } from '@/context/auth'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()
  const { refreshAuth } = useAuth()

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')

    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()

      if (data.success) {
        await refreshAuth()
        router.push('/')
      } else {
        setError('Login Failed')
      }
    } catch (error) {
      setError('Login Failed')
      console.error('Login error:', error)
    }
  }

  return (
    <div className="login-container">
      <h1 className="login-title">💡 Please Login First</h1>
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            className="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            className="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="login-btn">
          Login
        </button>
      </form>
      {error && <p className="error-message">{error}</p>}
      <Link href="/register" className="register-link">
        Don't have an account? Register here
      </Link>
    </div>
  )
}
