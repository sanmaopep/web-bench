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
