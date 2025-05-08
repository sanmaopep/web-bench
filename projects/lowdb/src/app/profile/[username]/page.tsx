import { getCurrentUser } from '@/actions/auth'
import { notFound, redirect } from 'next/navigation'
import './profile.css'
import RechargeButton from './recharge-button'

export default async function Profile({ params }: { params: { username: string } }) {
  const currentUser = await getCurrentUser()
  
  if (!currentUser) {
    redirect('/login')
  }
  
  // Only allow users to view their own profile or admins to view any profile
  if (currentUser.role !== 'admin' && currentUser.username !== params.username) {
    redirect('/login')
  }
  
  // Find the user
  const user = global.db.data.users.find(u => u.username === params.username)
  
  if (!user) {
    notFound()
  }
  
  const isOwnProfile = currentUser.username === params.username
  
  // Generate a referral code based on username
  const referralCode = Buffer.from(params.username).toString('base64')
  
  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-avatar">
          {params.username.charAt(0).toUpperCase()}
        </div>
        <h1 className="profile-username">{user.username}</h1>
        <div className="profile-details">
          <div className="profile-role">Role: {user.role}</div>
          <div className="profile-coin">Coins: {user.coin}</div>
          {isOwnProfile && (
            <div className="recharge-container">
              <RechargeButton />
            </div>
          )}
        </div>
        
        {isOwnProfile && (
          <div className="referral-section">
            <h2 className="referral-title">Invite Friends & Earn Rewards</h2>
            <div className="referral-code-container">
              <div className="referral-code">{referralCode}</div>
            </div>
            <p className="referral-description">
              When a new user registers through your referral code, you will earn $888, and an additional $1888 when they pay for their first order.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}