'use server'

import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'

export async function getLoggedInUser() {
  try {
    const tokenCookie = (await cookies()).get('TOKEN')
    
    if (!tokenCookie) {
      return null
    }
    
    const secret = new TextEncoder().encode('WEBBENCH-SECRET')
    const { payload } = await jwtVerify(tokenCookie.value, secret)
    
    return {
      username: payload.username as string,
      role: payload.role as string
    }
  } catch (error) {
    return null
  }
}