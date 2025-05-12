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