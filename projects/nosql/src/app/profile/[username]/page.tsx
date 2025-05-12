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
import RechargeCoinButton from './RechargeCoinButton'
import './style.css'

export default async function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const currentUser = await getCurrentUser()
  if (!currentUser) {
    redirect('/login')
  }

  const { username } = await params

  if (currentUser.role !== 'admin' && currentUser.username !== username) {
    redirect('/login')
  }

  const user = await User.findOne({ username })
  if (!user) {
    return <div className="profile-not-found">User not found</div>
  }

  if (!user.referralCode) {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase()
    await User.findOneAndUpdate(
      { username },
      { referralCode: code }
    )
    user.referralCode = code
  }

  return (
    <div className="profile-container">
      <h1 className="profile-username">{user.username}</h1>
      <div className="profile-coin">💰 {user.coin} coins</div>
      {currentUser.username === username && <RechargeCoinButton />}
      
      <div className="referral-section">
        <div className="referral-code">{user.referralCode}</div>
        <p className="referral-rule">
          When a new user registers through your referral code, you will earn $888, and an additional $1888 when they pay for their first order.
        </p>
      </div>
    </div>
  )
}