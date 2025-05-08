import { NextResponse } from 'next/server'
import User from '@/model/user'

export async function POST(request: Request) {
  const { username, password, role, coin, referralCode } = await request.json()
  await User.create({ username, password, role, coin })

  if (referralCode) {
    const referrer = await User.findOne({ referralCode })
    if (referrer) {
      // Immediately give the registration bonus
      await User.findOneAndUpdate(
        { username: referrer.username },
        { 
          $inc: { coin: 888 },
          $push: { referralPending: username }
        }
      )
    }
  }

  return NextResponse.json({ success: true })
}