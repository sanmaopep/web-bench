'use server'

import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'

const SECRET = new TextEncoder().encode('WEBBENCH-SECRET')

export async function getCurrentUser() {
  try {
    const token = (await cookies()).get('TOKEN')?.value

    if (!token) {
      return null
    }

    const { payload } = await jwtVerify(token, SECRET)
    
    const user = global.db.data.users.find(u => u.username === payload.username)
    
    if (!user) {
      return null
    }
    
    return {
      username: user.username,
      role: user.role,
      coin: user.coin
    }
  } catch (error) {
    return null
  }
}