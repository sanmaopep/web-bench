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

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { registerUser } from '@/actions/register'
import './register.css'
import { useAuth } from '@/context/auth'
import { useRouter } from 'next/navigation'

export default function Register() {
  const [error, setError] = useState('')
  const { refreshAuth } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')

    const formData = new FormData(e.currentTarget)
    const result = await registerUser(formData)

    if (result?.success) {
      await refreshAuth()
      router.push('/')
    } else {
      setError(result?.error || 'Registration failed')
    }
  }

  return (
    <div className="register-container">
      <h1>📝 Create an Account</h1>
      {error && <div className="error-message">{error}</div>}
      <form className="register-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input type="text" id="username" name="username" className="username" required />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" className="password" required />
        </div>
        <div className="form-group">
          <label htmlFor="confirm-password">Confirm Password</label>
          <input
            type="password"
            id="confirm-password"
            name="confirm-password"
            className="confirm-password"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="referral-code">Referral Code (Optional)</label>
          <input
            type="text"
            id="referral-code"
            name="referral-code"
            className="referral-code-input"
            placeholder="Enter referral code if you have one"
          />
          <p className="referral-info">Use a friend's referral code to get started!</p>
        </div>
        <button type="submit" className="register-button">
          Register
        </button>
      </form>
      <Link href="/login" className="login-link">
        Already have an account? Login
      </Link>
    </div>
  )
}