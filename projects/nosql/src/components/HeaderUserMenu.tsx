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