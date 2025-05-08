'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import './header-user-menu.css'
import { useAuth } from '@/context/auth'

export default function HeaderUserMenu() {
  const { auth, refreshAuth } = useAuth()
  const [showDropdown, setShowDropdown] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    const response = await fetch('/api/auth/logout', {
      method: 'POST',
    })
    if (response.ok) {
      await refreshAuth()
      router.push('/')
    }
  }

  if (!auth?.username) {
    return (
      <div className="header-login-container">
        <Link href="/login" className="header-go-login">
          Login
        </Link>
      </div>
    )
  }

  return (
    <div className="header-user-container">
      <div
        className="header-username"
        onMouseEnter={() => setShowDropdown(true)}
        onMouseLeave={() => setShowDropdown(false)}
      >
        {auth.username}
        {showDropdown && (
          <div className="header-dropdown">
            <Link href={`/profile/${auth.username}`} className="header-go-user-profile">
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