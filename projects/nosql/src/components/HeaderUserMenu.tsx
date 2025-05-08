'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import './style.css'
import { logout } from '@/actions/auth'

interface User {
  username: string
  role: string
}

export default function HeaderUserMenu() {
  const [user, setUser] = useState<User | null>(null)
  const [showDropdown, setShowDropdown] = useState(false)

  useEffect(() => {
    const fetchUser = () => {
      fetch('/api/auth')
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => setUser(data))
    }

    fetchUser()

    window.addEventListener('refreshAuth', fetchUser)
    return () => {
      window.removeEventListener('refreshAuth', fetchUser)
    }
  }, [])

  const handleLogout = async () => {
    await logout()
    window.dispatchEvent(new Event('refreshAuth'))
  }

  if (!user) {
    return (
      <Link href="/login" className="header-go-login">
        Login
      </Link>
    )
  }

  return (
    <div className="header-user-menu">
      <div
        className="header-username"
        onMouseEnter={() => setShowDropdown(true)}
        onMouseLeave={() => setShowDropdown(false)}
      >
        {user.username}
        {showDropdown && (
          <div className="header-dropdown">
            <Link href={`/profile/${user.username}`} className="header-go-user-profile">
              Profile
            </Link>
            <Link href="/orders" className="header-go-to-my-orders">
              My Orders
            </Link>
            <button onClick={handleLogout} className="header-logout-btn">
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  )
}