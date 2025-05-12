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
import { getLoggedInUser } from '@/actions/auth'
import { User } from '@/model'
import './profile.css'
import RechargeButton from '@/components/RechargeButton'
import ReferralCode from '@/components/ReferralCode'

export default async function Profile({
  params: dynamicParams,
}: {
  params: Promise<{ username: string }>
}) {
  const params = await dynamicParams

  const currentUser = await getLoggedInUser()

  if (!currentUser) {
    redirect('/login')
  }

  // Check if user has access permission (own profile or admin)
  if (currentUser.username !== params.username && currentUser.role !== 'admin') {
    redirect('/login')
  }

  // Fetch user profile
  const profileUser = await User.findOne({
    where: { username: params.username },
  })

  if (!profileUser) {
    return (
      <div className="profile-container">
        <h1 className="profile-not-found">User not found</h1>
      </div>
    )
  }

  const isCurrentUser = currentUser.username === params.username

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h1 className="profile-username">{profileUser.username}</h1>
        <div className="profile-info">
          <div className="profile-role">Role: {profileUser.role}</div>
          <div className="profile-coin">Coins: {profileUser.coin}</div>
          {isCurrentUser && <RechargeButton username={profileUser.username} />}
          {isCurrentUser && profileUser.referralCode && (
            <ReferralCode code={profileUser.referralCode} />
          )}
        </div>
      </div>
    </div>
  )
}