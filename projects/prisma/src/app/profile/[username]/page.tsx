import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/actions/auth'
import { prisma } from '@/libs/db'
import './profile.css'
import RechargeButton from './RechargeButton'
import ReferralCode from './ReferralCode'

export default async function ProfilePage({
  params,
}: {
  params: { username: string }
}) {
  const currentUser = await getCurrentUser()
  
  if (!currentUser) {
    redirect('/login')
  }
  
  // Check if user has permission to view this profile
  if (currentUser.role !== 'admin' && currentUser.username !== params.username) {
    redirect('/login')
  }
  
  // Get the requested user profile
  const user = await prisma.user.findUnique({
    where: { username: params.username },
    select: {
      username: true,
      role: true,
      coin: true,
      referralCode: true
    }
  })
  
  if (!user) {
    return (
      <div className="profile-container">
        <h1 className="profile-not-found">User not found</h1>
      </div>
    )
  }
  
  const isCurrentUser = currentUser.username === user.username
  
  return (
    <div className="profile-container">
      <div className="profile-card">
        <h1 className="profile-username">{user.username}</h1>
        <div className="profile-role">Role: {user.role}</div>
        <div className="profile-coin">Coins: {user.coin}</div>
        
        {isCurrentUser && (
          <>
            <RechargeButton username={user.username} />
            <ReferralCode referralCode={user.referralCode} />
          </>
        )}
      </div>
    </div>
  )
}