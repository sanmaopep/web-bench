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
