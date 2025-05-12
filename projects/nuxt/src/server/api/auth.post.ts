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

import { db } from '~/libs/db'
import { SignJWT } from 'jose'

export default defineEventHandler(async (event) => {
  const { username, password } = await readBody(event)
  
  return new Promise((resolve, reject) => {
    db.get('SELECT username, role FROM users WHERE username = ? AND password = ?', [username, password], async (err, row) => {
      if (err || !row) {
        return reject(createError({
          statusCode: 401,
          message: 'Invalid credentials'
        }))
      }
      
      const secret = new TextEncoder().encode('WEBBENCH-SECRET')
      const token = await new SignJWT({ username: row.username, role: row.role })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('1h')
        .sign(secret)
      
      setCookie(event, 'TOKEN', token, {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 60 * 60 // 1 hour
      })
      
      resolve({ success: true })
    })
  })
})