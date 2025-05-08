import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/actions/auth'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const currentUser = await getCurrentUser()

  if (!currentUser || currentUser.role !== 'admin') {
    redirect('/login')
  }

  return <>{children}</>
}