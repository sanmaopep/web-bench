'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import '../admin.css'

interface User {
  username: string
  role: string
  coin: number
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([])
  const router = useRouter()

  useEffect(() => {
    fetch('/api/auth')
      .then((response) => response.json())
      .then((data) => {
        if (data.success === false || data.role !== 'admin') {
          router.push('/login')
        } else {
          fetchUsers()
        }
      })
  }, [router])

  const fetchUsers = () => {
    fetch('/api/users')
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setUsers(data.users)
        }
      })
  }

  return (
    <div className="admin-container">
      <h1>Admin User Portal</h1>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Role</th>
            <th>Coin</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.username} id={`admin_user_${user.username}`}>
              <td>{user.username}</td>
              <td>{user.role}</td>
              <td>{user.coin}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
