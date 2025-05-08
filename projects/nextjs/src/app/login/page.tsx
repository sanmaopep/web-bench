'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import './login.css'
import { useAuth } from '@/context/auth'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const { refreshAuth } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const response = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })
    const data = await response.json()
    if (data.success) {
      await refreshAuth()
      router.push('/')
    } else {
      setError('Login Failed')
    }
  }

  return (
    <div className="login-container">
      <h2>💡 Please Login First</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        <input
          type="text"
          className="username"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          className="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="login-btn">
          Login
        </button>
      </form>
      {error && <p className="error-message">{error}</p>}
      <Link href="/register" className="register-link">
        Don't have an account? Register
      </Link>
    </div>
  )
}
