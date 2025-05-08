'use server'

import { prisma } from '@/libs/db'
import { cookies } from 'next/headers'
import { SignJWT } from 'jose'

// Function to generate random referral code
function generateReferralCode(length = 8) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

// Define a User type
type User = {
  id: number;
  username: string;
  password: string;
  role: string;
  coin: number;
  referralCode: string;
  referredBy: string | null;
  isFirstPurchase: boolean;
};

export async function registerUser(username: string, password: string, referralCode?: string) {
  try {
    // Check if username already exists
    const existingUser = await prisma.user.findUnique({
      where: { username }
    })

    if (existingUser) {
      return { success: false, error: 'Username already exists' }
    }

    // Process referral if provided
    let referrer: User | null = null;
    if (referralCode) {
      referrer = await prisma.user.findUnique({
        where: { referralCode }
      });

      if (!referrer) {
        return { success: false, error: 'Invalid referral code' }
      }
    }

    // Create new user with a unique referral code
    const newUser = await prisma.user.create({
      data: {
        username,
        password,
        role: 'user',
        coin: 1000,
        referralCode: generateReferralCode(8),
        isFirstPurchase: true,
        referredBy: referrer ? referrer.username : null
      }
    })

    // Award referrer bonus for successful signup
    if (referrer) {
      await prisma.user.update({
        where: { username: referrer.username },
        data: {
          coin: { increment: 888 }
        }
      });
    }

    // Generate JWT token for auto login
    const token = await new SignJWT({ 
      username: newUser.username, 
      role: newUser.role 
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('1h')
      .sign(new TextEncoder().encode('WEBBENCH-SECRET'))

    // Set token cookie
    const cookieStore = await cookies()
    cookieStore.set({
      name: 'TOKEN',
      value: token,
      httpOnly: true,
      path: '/',
    })

    return { success: true }
  } catch (error) {
    console.error('Registration error:', error)
    return { success: false, error: 'Registration failed' }
  }
}