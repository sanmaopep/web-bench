'use server'

import { User } from '@/model'
import { generateReferralCode } from '@/model/user'
import { SignJWT } from 'jose'
import { cookies } from 'next/headers'
import { sequelize } from '@/libs/db'

export async function register(username: string, password: string, referralCode?: string) {
  const transaction = await sequelize.transaction()
  
  try {
    // Check if username already exists
    const existingUser = await User.findOne({ 
      where: { username },
      transaction
    })
    
    if (existingUser) {
      await transaction.rollback()
      return {
        success: false,
        error: 'Username already exists'
      }
    }
    
    // Check referral code if provided
    let referrer: User | null = null
    if (referralCode) {
      referrer = await User.findOne({ 
        where: { referralCode },
        transaction
      })
      
      if (!referrer) {
        await transaction.rollback()
        return {
          success: false,
          error: 'Invalid referral code'
        }
      }
    }
    
    // Create new user with a unique referral code
    const newUser = await User.create({
      username,
      password,
      role: 'user',
      coin: 1000,
      referralCode: generateReferralCode(),
      referredBy: referrer ? referrer.username : null
    }, { transaction })
    
    // If user was referred, give the referrer the initial reward
    if (referrer) {
      await referrer.update({
        coin: referrer.coin + 888
      }, { transaction })
    }
    
    // Create and set token for auto login
    const secret = new TextEncoder().encode('WEBBENCH-SECRET')
    const token = await new SignJWT({ 
      username: newUser.username, 
      role: newUser.role 
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('1h')
      .sign(secret)
    
    ;(await cookies()).set({
      name: 'TOKEN',
      value: token,
      httpOnly: true,
      path: '/',
    })
    
    await transaction.commit()
    
    return {
      success: true
    }
  } catch (error) {
    await transaction.rollback()
    console.error('Registration error:', error)
    return {
      success: false,
      error: 'Failed to register'
    }
  }
}