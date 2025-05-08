'use server'

import { cookies } from 'next/headers'
import { SignJWT } from 'jose'
import { v4 as uuidv4 } from 'uuid'
import { redirect } from 'next/navigation'

const SECRET = new TextEncoder().encode('WEBBENCH-SECRET')

export async function registerUser(formData: FormData) {
  const username = formData.get('username') as string
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirm-password') as string
  const referralCode = formData.get('referral-code') as string

  if (password !== confirmPassword) {
    return { success: false, error: 'Passwords must match' }
  }

  // Check if the username already exists
  const existingUser = global.db.data.users.find(u => u.username === username)
  if (existingUser) {
    return { success: false, error: 'Username already exists' }
  }

  // Create new user
  const newUser = {
    username,
    password,
    role: 'user' as const,
    coin: 1000
  }

  // Process referral if code is provided
  if (referralCode) {
    try {
      // Decode the referral code to get referrer username
      const referrerUsername = Buffer.from(referralCode, 'base64').toString('utf-8')
      
      // Find the referrer user
      const referrerIndex = global.db.data.users.findIndex(u => u.username === referrerUsername)
      
      if (referrerIndex >= 0) {
        // Add initial referral reward to referrer
        global.db.data.users[referrerIndex].coin += 888
        
        // Track this referral for future order reward
        if (!global.db.data.referrals) {
          global.db.data.referrals = []
        }
        
        global.db.data.referrals.push({
          referrerUsername,
          newUserUsername: username,
          initialRewardPaid: true,
          orderRewardPaid: false
        })
      }
    } catch (error) {
      console.error('Invalid referral code:', error)
      // Continue with registration even if referral processing fails
    }
  }

  // Add user to database
  global.db.data.users.push(newUser)
  await global.db.write()

  // Generate JWT token
  const token = await new SignJWT({
    username: newUser.username,
    role: newUser.role
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1h')
    .sign(SECRET)

  // Set cookie
  ;(await cookies()).set({
    name: 'TOKEN',
    value: token,
    httpOnly: true,
    path: '/',
  })

  return { success: true }
}