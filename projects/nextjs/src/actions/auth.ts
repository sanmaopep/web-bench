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

'use server'

import { cookies } from 'next/headers'
import * as jose from 'jose'
import db from '@/libs/db'
import { generateReferralCode } from '@/libs/utils'

import { creditReferrer } from './referer'

const secret = new TextEncoder().encode('WEBBENCH-SECRET')

export async function getCurrentUser(): Promise<{ username: string; role: string } | null> {
  const token = (await cookies()).get('TOKEN')?.value

  if (!token) {
    return null
  }

  try {
    const { payload } = await jose.jwtVerify(token, secret)
    return payload as { username: string; role: string }
  } catch (error) {
    return null
  }
}

export async function register(
  username: string,
  password: string,
  referralCode?: string
): Promise<{ success: boolean; error?: string }> {
  // Check if username exists
  const userExists = await new Promise<boolean>((resolve, rejects) => {
    db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
      if (err) {
        rejects(err)
      }
      resolve(!!row)
    })
  })

  if (userExists) {
    return { success: false, error: 'Username already exists' }
  }

  // Check Referer Exists
  if (referralCode) {
    const referrerExists = await new Promise<boolean>((resolve, rejects) => {
      db.get('SELECT * FROM users WHERE referral_code = ?', [referralCode], (err, row) => {
        if (err) {
          rejects(err)
        }
        resolve(!!row)
      })
    })
    if (!referrerExists) {
      return { success: false, error: 'Invalid referral code' }
    }
  }

  const newReferralCode = generateReferralCode()

  // Insert new user
  const insertResult = await new Promise<boolean>((resolve, rejects) => {
    db.run(
      'INSERT INTO users (username, password, role, coin, referral_code, referrer_referral_code) VALUES (?, ?, ?, ?, ?, ?)',
      [username, password, 'user', 1000, newReferralCode, referralCode],
      function (err) {
        if (err) {
          rejects(err)
        }
        resolve(true)
      }
    )
  })

  if (!insertResult) {
    return { success: false, error: 'Failed to insert user' }
  }

  if (referralCode) {
    await creditReferrer(referralCode, 888)
  }

  try {
    // Create and set JWT token
    const token = await new jose.SignJWT({ username, role: 'user' })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('1h')
      .sign(secret)
    ;(await cookies()).set('TOKEN', token, { httpOnly: true, secure: true })
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to create token' }
  }
}
