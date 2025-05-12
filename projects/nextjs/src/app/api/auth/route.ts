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

import { NextRequest, NextResponse } from 'next/server'
import db from '@/libs/db'
import * as jose from 'jose'

const secret = new TextEncoder().encode('WEBBENCH-SECRET')

export async function POST(request: NextRequest) {
  const body = await request.json()

  return new Promise((resolve) => {
    db.get(
      'SELECT * FROM users WHERE username = ? AND password = ?',
      [body.username, body.password],
      async (err, row: any) => {
        if (err) {
          resolve(NextResponse.json({ success: false, error: err.message }, { status: 500 }))
        } else if (row) {
          const token = await new jose.SignJWT({ username: row.username, role: row.role })
            .setProtectedHeader({ alg: 'HS256' })
            .setExpirationTime('1h')
            .sign(secret)

          const response = NextResponse.json({
            success: true,
            username: row.username,
            role: row.role,
          })
          response.cookies.set('TOKEN', token, { httpOnly: true, secure: true })
          resolve(response)
        } else {
          resolve(
            NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 })
          )
        }
      }
    )
  })
}

export async function GET(request: NextRequest) {
  const token = request.cookies.get('TOKEN')?.value

  if (!token) {
    return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 })
  }

  try {
    const { payload } = await jose.jwtVerify(token, secret)

    return new Promise((resolve) => {
      db.get(
        'SELECT username, role, coin FROM users WHERE username = ?',
        [payload.username],
        (err, row: any) => {
          if (err) {
            resolve(NextResponse.json({ success: false, error: err.message }, { status: 500 }))
          } else if (row) {
            resolve(
              NextResponse.json({
                success: true,
                username: row.username,
                role: row.role,
                coin: row.coin,
              })
            )
          } else {
            resolve(NextResponse.json({ success: false, error: 'User not found' }, { status: 404 }))
          }
        }
      )
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 })
  }
}

export async function DELETE(request: NextRequest) {
  const response = NextResponse.json({ success: true })
  response.cookies.set('TOKEN', '', { maxAge: 0 })
  return response
}
