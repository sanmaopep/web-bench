'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import './HeaderUserMenu.css'
import { useAuth } from '@/context/auth'

export default function HeaderUserMenu() {
  const { auth, refreshAuth } = useAuth()
  const [showDropdown, setShowDropdown] = useState(false)
  const router = useRouter()

  const { username } = auth || {}

  const handleLogout = async () => {
    const response = await fetch('/api/auth', { method: 'DELETE' })
    if (response.ok) {
      refreshAuth()
      router.push('/')
    }
  }

  if (!username) {
    return (
      <Link href="/login">
        <button className="header-go-login">Login</button>
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
        {username}
        {showDropdown && (
          <div className="header-dropdown">
            <Link href={`/profile/${username}`}>
              <button className="header-go-user-profile">Profile</button>
            </Link>
            <Link href="/orders">
              <button className="header-go-to-my-orders">My Orders</button>
            </Link>
            <button className="header-logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
