'use client'

import Link from 'next/link'
import './admin-navigation.css'

export default function AdminNavigation() {
  return (
    <div className="admin-navigation">
      <Link href="/admin/products" className="admin-nav-link">
        Products Management
      </Link>
      <Link href="/admin/users" className="admin-nav-link">
        Users Management
      </Link>
      <Link href="/admin/orders" className="admin-nav-link">
        Orders Management
      </Link>
    </div>
  )
}