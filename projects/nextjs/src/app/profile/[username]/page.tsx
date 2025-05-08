'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import '../profile.css'
import { useAuth } from '@/context/auth'

interface User {
  username: string
  role: string
  coin: number
  referralCode: string
}

export default function Profile() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { username } = useParams()
  const router = useRouter()
  const { auth, refreshAuth } = useAuth()

  useEffect(() => {
    fetch('/api/auth')
      .then((response) => response.json())
      .then((data) => {
        if (data.success === false) {
          router.push('/login')
        } else if (data.role !== 'admin' && data.username !== username) {
          router.push('/login')
        } else {
          fetchUserData()
        }
      })
  }, [username, router])

  const fetchUserData = () => {
    fetch(`/api/users/${username}`)
      .then((response) => response.json())
      .then((userData) => {
        if (userData.success) {
          setUser(userData.user)
        } else {
          setError('User not found')
        }
        setLoading(false)
      })
  }

  const handleRecharge = async () => {
    const response = await fetch(`/api/users/${username}`, { method: 'POST' })
    const data = await response.json()
    if (data.success) {
      setUser((prevUser) => (prevUser ? { ...prevUser, coin: data.coin } : null))
      refreshAuth()
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>{error}</div>
  }

  if (!user) {
    return <div>User not found</div>
  }

  return (
    <div className="profile-container">
      <h1 className="profile-username">{user.username}</h1>
      <div className="profile-coin">Coins: {user.coin}</div>
      {auth?.username === user.username && (
        <button className="recharge-button" onClick={handleRecharge}>
          Recharge
        </button>
      )}
      <div className="referral-code-container">
        <h2>Your Referral Code</h2>
        <div className="referral-code">{user.referralCode}</div>
        <p className="referral-rule">
          When a new user registers through your referral code, you will earn $888, and an
          additional $1888 when they pay for their first order.
        </p>
      </div>
    </div>
  )
}
