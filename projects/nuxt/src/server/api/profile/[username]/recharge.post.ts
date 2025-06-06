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

export default defineEventHandler(async (event) => {
  const username = event.context.params?.username
  
  // Authenticate the user
  const cookie = getCookie(event, 'TOKEN')
  if (!cookie) {
    throw createError({
      statusCode: 401,
      message: 'Not authenticated'
    })
  }
  
  try {
    const secret = new TextEncoder().encode('WEBBENCH-SECRET')
    const { jwtVerify } = await import('jose')
    const { payload } = await jwtVerify(cookie, secret)
    
    // Make sure the user is recharging their own account
    if (payload.username !== username) {
      throw createError({
        statusCode: 403,
        message: 'Forbidden'
      })
    }
    
    return new Promise((resolve, reject) => {
      db.run(
        'UPDATE users SET coin = coin + 1000 WHERE username = ?',
        [username],
        function(err) {
          if (err) {
            reject(createError({
              statusCode: 500,
              message: 'Failed to recharge'
            }))
            return
          }
          
          if (this.changes === 0) {
            reject(createError({
              statusCode: 404,
              message: 'User not found'
            }))
            return
          }
          
          resolve({ success: true })
        }
      )
    })
  } catch (err) {
    throw createError({
      statusCode: 401,
      message: 'Invalid token'
    })
  }
})