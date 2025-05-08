'use server'

import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'

export async function getCurrentUser(): Promise<{ username?: string; role?: string }> {
  const cookieStore = await cookies()
  const token = cookieStore.get('TOKEN')

  if (!token) {
    return {}
  }

  try {
    const verified = await jwtVerify(
      token.value,
      new TextEncoder().encode('WEBBENCH-SECRET')
    )

    return verified.payload  as { username: string; role: string }
  } catch (error) {
    return {}
  }
}