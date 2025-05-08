'use client'

import { redirect } from 'next/navigation'
import Link from 'next/link'
import './style.css'
import { useState } from 'react'

export default function Login() {
  const [loginFailed, setLoginFailed] = useState(false)

  async function handleSubmit(formData: FormData) {
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: formData.get('username'),
        password: formData.get('password'),
      }),
    })

    if (res.ok) {
      window.dispatchEvent(new Event('refreshAuth'))

      redirect('/')
    } else {
      setLoginFailed(true)
    }
  }

  return (
    <form action={handleSubmit} className="login-form">
      <h1>💡 Please Login First</h1>
      <input type="text" name="username" placeholder="Username" className="username" required />
      <input type="password" name="password" placeholder="Password" className="password" required />
      <button type="submit" className="login-btn">
        Login
      </button>
      {loginFailed && <p className="error">Login Failed</p>}
      <Link href="/register" className="register-link">
        Need an account? Register
      </Link>
    </form>
  )
}
