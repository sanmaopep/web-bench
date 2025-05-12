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