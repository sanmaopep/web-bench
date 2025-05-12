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

import { useAuth } from '@/context/auth'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import './admin.css'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { auth } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!auth?.username || auth.role !== 'admin') {
      router.push('/login')
    }
  }, [auth, router])

  if (!auth?.username || auth.role !== 'admin') {
    return null
  }

  return (
    <div className="admin-layout">
      <div className="admin-sidebar">
        <h2>Admin Portal</h2>
        <nav>
          <a href="/admin/products" className="admin-nav-link">Products</a>
          <a href="/admin/users" className="admin-nav-link">Users</a>
          <a href="/admin/orders" className="admin-nav-link">Orders</a>
        </nav>
      </div>
      <div className="admin-content">
        {children}
      </div>
    </div>
  )
}