'use server'

import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode('WEBBENCH-SECRET')

export async function getCurrentUser() {
  const token = (await cookies()).get('TOKEN')?.value

  if (!token) {
    return null
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as { username: string; role: string }
  } catch (error) {
    return null
  }
}

export async function logout() {
  ;(await cookies()).delete('TOKEN')
}
