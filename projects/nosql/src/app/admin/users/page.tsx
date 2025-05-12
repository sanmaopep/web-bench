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

import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/actions/auth'
import User from '@/model/user'
import './style.css'

export default async function AdminUsersPage() {
  const currentUser = await getCurrentUser()
  
  if (!currentUser || currentUser.role !== 'admin') {
    redirect('/login')
  }

  const users = await User.find()

  return (
    <div className="admin-users">
      <h1>User Management</h1>
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