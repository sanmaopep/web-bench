import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/actions/auth'
import AdminNavigation from './AdminNavigation'
import './admin.css'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()

  if (!user?.username || user.role !== 'admin') {
    redirect('/login')
  }

  return (
    <div className="admin-layout">
      <h1 className="admin-title">Admin Portal</h1>
      <AdminNavigation />
      {children}
    </div>
  )
}