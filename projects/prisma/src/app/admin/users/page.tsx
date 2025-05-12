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

import { prisma } from '@/libs/db'
import '../admin.css'

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany()

  return (
    <div>
      <h2 className="admin-section-title">User Management</h2>
      
      {users.length === 0 ? (
        <p className="admin-no-items">No users found</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Role</th>
              <th>Coins</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} id={`admin_user_${user.username}`}>
                <td>{user.id}</td>
                <td className="username-cell">{user.username}</td>
                <td className="role-cell">{user.role}</td>
                <td className="coin-cell">{user.coin}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}