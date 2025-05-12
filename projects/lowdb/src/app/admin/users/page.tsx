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