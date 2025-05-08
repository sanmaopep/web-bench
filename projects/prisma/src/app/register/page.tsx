'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { registerUser } from './register-action'
import './register.css'
import { useAuth } from '@/context/auth'

export default function RegisterPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [referralCode, setReferralCode] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()
  const { refreshAuth } = useAuth()

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords must match')
      return
    }

    try {
      const result = await registerUser(username, password, referralCode)

      if (result.success) {
        await refreshAuth()
        router.push('/')
      } else {
        setError(result.error || 'Registration failed')
      }
    } catch (error) {
      setError('Registration failed')
      console.error('Registration error:', error)
    }
  }

  return (
    <div className="register-container">
      <h1 className="register-title">📝 Register New Account</h1>
      <form className="register-form" onSubmit={handleSubmit}>
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
        <div className="form-group">
          <label htmlFor="confirm-password">Confirm Password</label>
          <input
            type="password"
            id="confirm-password"
            className="confirm-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="referral-code">Referral Code (Optional)</label>
          <input
            type="text"
            id="referral-code"
            className="referral-code-input"
            value={referralCode}
            onChange={(e) => setReferralCode(e.target.value)}
          />
        </div>
        <button type="submit" className="register-button">
          Register
        </button>
      </form>
      {error && <p className="error-message">{error}</p>}
      <Link href="/login" className="login-link">
        Already have an account? Login here
      </Link>
    </div>
  )
}