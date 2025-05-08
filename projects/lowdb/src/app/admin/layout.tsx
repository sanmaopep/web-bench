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