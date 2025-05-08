import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/actions/auth'
import User from '@/model/user'

export async function POST() {
  const currentUser = await getCurrentUser()
  
  if (!currentUser) {
    return new Response(null, { status: 401 })
  }

  await User.findOneAndUpdate(
    { username: currentUser.username },
    { $inc: { coin: 1000 } }
  )

  return NextResponse.json({ success: true })
}