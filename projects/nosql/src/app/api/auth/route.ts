import { NextResponse } from 'next/server'
import { jwtVerify, SignJWT } from 'jose'
import User from '@/model/user'
import { cookies } from 'next/headers'

const JWT_SECRET = new TextEncoder().encode('WEBBENCH-SECRET')

export async function POST(request: Request) {
  const { username, password } = await request.json()
  const user = await User.findOne({ username, password })

  if (!user) {
    return new Response(null, { status: 401 })
  }

  const token = await new SignJWT({
    username: user.username,
    role: user.role,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('1h')
    .sign(JWT_SECRET)

  ;(await cookies()).set('TOKEN', token)

  return NextResponse.json({ success: true })
}

export async function GET() {
  const token = (await cookies()).get('TOKEN')

  if (!token) {
    return new Response(null, { status: 401 })
  }

  try {
    const { payload } = await jwtVerify(token?.value, JWT_SECRET)

    const user = await User.findOne({
      username: payload?.username,
    })

    if (!user) {
      return new Response(null, { status: 401 })
    }

    return NextResponse.json({
      username: user.username,
      role: user.role,
      coin: user.coin,
    })
  } catch (error) {
    return new Response(null, { status: 401 })
  }
}
