'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import './headerUserMenu.css'

interface User {
  username: string
  role: string
  coin: number
}

export default function HeaderUserMenu() {
  const [user, setUser] = useState<User | null>(null)
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await fetch('/api/auth')
        if (response.ok) {
          const userData = await response.json()
          setUser(userData)
        } else {
          setUser(null)
        }
      } catch (error) {
        setUser(null)
      }
    }

    fetchUser()

    window.addEventListener('refreshAuth', fetchUser)
    return () => {
      window.removeEventListener('refreshAuth', fetchUser)
    }
  }, [])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      setUser(null)
      router.push('/login')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const handleProfileClick = () => {
    if (user) {
      router.push(`/profile/${user.username}`)
      setShowDropdown(false)
    }
  }

  const handleOrdersClick = () => {
    router.push('/orders')
    setShowDropdown(false)
  }

  return (
    <div className="header-user-menu">
      {user ? (
        <div className="header-user-container" ref={dropdownRef}>
          <div className="header-username" onMouseEnter={() => setShowDropdown(!showDropdown)}>
            {user.username}
          </div>
          {showDropdown && (
            <div className="header-dropdown">
              <button className="header-go-user-profile" onClick={handleProfileClick}>
                My Profile
              </button>
              <button className="header-go-to-my-orders" onClick={handleOrdersClick}>
                My Orders
              </button>
              <button className="header-logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
      ) : (
        <button className="header-go-login" onClick={() => router.push('/login')}>
          Login
        </button>
      )}
    </div>
  )
}
