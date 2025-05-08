'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { register } from '@/actions/auth'
import './register.css'
import { useAuth } from '@/context/auth'

export default function Register() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [referralCode, setReferralCode] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const { refreshAuth } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setError('Passwords must match')
      return
    }
    const result = await register(username, password, referralCode)

    if (result.success) {
      await refreshAuth()
      router.push('/')
    } else {
      setError(result.error || 'Registration failed')
    }
  }

  return (
    <div className="register-container">
      <h2>Register</h2>
      <form className="register-form" onSubmit={handleSubmit}>
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
        <input
          type="password"
          className="confirm-password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <input
          type="text"
          className="referral-code-input"
          placeholder="Referral Code (Optional)"
          value={referralCode}
          onChange={(e) => setReferralCode(e.target.value)}
        />
        <button type="submit" className="register-button">
          Register
        </button>
      </form>
      {error && <div className="error-message">{error}</div>}
      <Link href="/login" className="login-link">
        Already have an account? Login
      </Link>
    </div>
  )
}
