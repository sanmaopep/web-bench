'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import './users-admin.css'

interface User {
  username: string
  role: string
  coin: number
  createdAt: string
  updatedAt: string
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    async function checkUser() {
      try {
        const response = await fetch('/api/auth')
        if (response.ok) {
          const userData = await response.json()
          if (userData.role !== 'admin') {
            router.push('/login')
          } else {
            fetchUsers()
          }
        } else {
          router.push('/login')
        }
      } catch (error) {
        router.push('/login')
      }
    }

    async function fetchUsers() {
      try {
        const response = await fetch('/api/users')
        const data = await response.json()
        if (data.success) {
          setUsers(data.users)
        } else {
          setError('Failed to load users')
        }
      } catch (error) {
        setError('Failed to load users')
      } finally {
        setLoading(false)
      }
    }

    checkUser()
  }, [router])

  if (loading) return <div className="admin-loading">Loading...</div>
  if (error) return <div className="admin-error">{error}</div>

  return (
    <div className="admin-users-container">
      <h1>Admin User Management</h1>
      
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Role</th>
              <th>Coins</th>
              <th>Created At</th>
              <th>Updated At</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.username} id={`admin_user_${user.username}`}>
                <td>{user.username}</td>
                <td>{user.role}</td>
                <td>{user.coin}</td>
                <td>{new Date(user.createdAt).toLocaleString()}</td>
                <td>{new Date(user.updatedAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}