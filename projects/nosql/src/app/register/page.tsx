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

import { redirect } from 'next/navigation'
import Link from 'next/link'
import { useState } from 'react'
import './style.css'

export default function Register() {
  const [error, setError] = useState('')

  async function handleSubmit(formData: FormData) {
    const username = formData.get('username') as string
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirm-password') as string
    const referralCode = formData.get('referral-code') as string

    if (password !== confirmPassword) {
      setError('Passwords must match')
      return
    }

    const checkRes = await fetch(`/api/usernames`)
    const usernames = await checkRes.json()

    if (usernames.includes(username)) {
      setError('Username already exists')
      return
    }

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password,
        role: 'user',
        coin: 1000,
        referralCode
      }),
    })

    if (res.ok) {
      await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      })

      window.dispatchEvent(new Event('refreshAuth'))

      redirect('/')
    }
  }

  return (
    <form action={handleSubmit} className="register-form">
      <h1>Register Account</h1>
      <input type="text" name="username" className="username" placeholder="Username" required />
      <input type="password" name="password" className="password" placeholder="Password" required />
      <input
        type="password"
        name="confirm-password"
        className="confirm-password"
        placeholder="Confirm Password"
        required
      />
      <input
        type="text"
        name="referral-code"
        className="referral-code-input"
        placeholder="Referral Code (Optional)"
      />
      {error && <div className="error-message">{error}</div>}
      <button type="submit" className="register-button">
        Register
      </button>
      <Link href="/login" className="login-link">
        Already have an account? Login
      </Link>
    </form>
  )
}