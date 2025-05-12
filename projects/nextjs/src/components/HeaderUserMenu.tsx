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
