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

import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import { useAuth } from '../context/auth'
import './profile.css'
import ReferralCode from '../components/ReferralCode'

interface UserProfile {
  username: string
  role: string
  coin: number
}

const Profile = () => {
  const { username } = useParams<{ username: string }>()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const { user, login } = useAuth()

  const isCurrentUser = user?.username === username

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`/api/users/${username}`)

        if (!response.ok) {
          if (response.status === 403 || response.status === 401) {
            setError('Unauthorized')
            navigate('/login')
          } else if (response.status === 404) {
            setError('User not found')
          } else {
            setError('Failed to load user profile')
          }
          setLoading(false)
          return
        }

        const data = await response.json()

        if (data.success) {
          setProfile(data.user)
        } else {
          setError(data.message || 'Failed to load user profile')
        }
      } catch (err) {
        setError('Error connecting to server')
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [navigate])

  const handleRecharge = async () => {
    try {
      const response = await fetch(`/api/users/${username}/recharge`, {
        method: 'POST',
      })

      if (!response.ok) {
        setError('Failed to recharge coins')
        return
      }

      const data = await response.json()
      
      if (data.success) {
        setProfile(prev => prev ? { ...prev, coin: prev.coin + 1000 } : null)
        await login() // Refresh auth context to update user data
      } else {
        setError(data.message || 'Failed to recharge coins')
      }
    } catch (err) {
      setError('Error connecting to server')
    }
  }

  if (loading) return <div className="profile-loading">Loading profile...</div>
  if (error) return <div className="profile-error">{error}</div>
  if (!profile) return <div className="profile-not-found">User not found</div>

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h1 className="profile-username">{profile.username}</h1>
        <div className="profile-role">Role: {profile.role}</div>
        <div className="profile-coin">Coins: {profile.coin}</div>
        
        {isCurrentUser && (
          <>
            <button 
              className="recharge-button"
              onClick={handleRecharge}
            >
              Recharge 1000 Coins
            </button>
            
            <ReferralCode username={profile.username} />
          </>
        )}
        
        <button className="profile-back-button" onClick={() => navigate('/')}>
          Back to Home
        </button>
      </div>
    </div>
  )
}

export default Profile