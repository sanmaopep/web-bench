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

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import './HeaderUserMenu.css'
import { useAuth } from '@/context/auth'

export default function HeaderUserMenu() {
  const { auth, refreshAuth } = useAuth()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const router = useRouter()
  const dropdownRef = useRef<HTMLDivElement>(null)

  const handleLogout = async () => {
    // Clear the cookie by making a request to a hypothetical logout endpoint
    // You would need to create this endpoint or modify existing auth endpoints
    await fetch('/api/auth/logout', { method: 'POST' })
    await refreshAuth()
    setDropdownOpen(false)
    router.push('/login')
  }

  return (
    <div className="header-user-menu">
      {auth?.username ? (
        <div className="header-user-container" ref={dropdownRef}>
          <div className="header-username" onMouseEnter={() => setDropdownOpen(true)}>
            {auth.username}
          </div>
          {dropdownOpen && (
            <div className="header-dropdown-menu">
              <Link
                href={`/profile/${auth.username}`}
                className="header-go-user-profile"
                onClick={() => setDropdownOpen(false)}
              >
                Profile
              </Link>
              <Link
                href="/orders"
                className="header-go-to-my-orders"
                onClick={() => setDropdownOpen(false)}
              >
                My Orders
              </Link>
              <button className="header-logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
      ) : (
        <Link href="/login" className="header-go-login">
          <button>Login</button>
        </Link>
      )}
    </div>
  )
}