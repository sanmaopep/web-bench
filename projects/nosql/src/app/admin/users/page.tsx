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