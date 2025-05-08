'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  username: string
  role: string
  coin: number
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([])
  const router = useRouter()

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/usernames')
        const usernames = await response.json()
        
        // Fetch detailed user information for each username
        const usersWithDetails: User[] = []
        
        for (const username of usernames) {
          const userResponse = await fetch(`/api/users/${username}`)
          const userData = await userResponse.json()
          
          if (userData.success) {
            usersWithDetails.push(userData.user)
          }
        }
        
        setUsers(usersWithDetails)
      } catch (error) {
        console.error('Failed to fetch users:', error)
      }
    }
    
    fetchUsers()
  }, [])

  return (
    <div className="admin-users">
      <div className="admin-header">
        <h1>Manage Users</h1>
      </div>
      
      <table className="admin-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Role</th>
            <th>Coins</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
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