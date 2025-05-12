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
import { jwtVerify } from 'jose'

export default defineEventHandler(async (event) => {
  const cookie = getCookie(event, 'TOKEN')
  const productId = event.context.params?.product_id
  
  if (!cookie) {
    throw createError({
      statusCode: 401,
      message: 'Not authenticated'
    })
  }
  
  try {
    const secret = new TextEncoder().encode('WEBBENCH-SECRET')
    const { payload } = await jwtVerify(cookie, secret)
    
    return new Promise((resolve, reject) => {
      // First check if user has already commented on this product
      db.get(
        'SELECT id FROM comments WHERE username = ? AND product_id = ?',
        [payload.username, productId],
        (err, comment) => {
          if (err) {
            reject(createError({
              statusCode: 500,
              message: 'Failed to check comment status'
            }))
            return
          }
          
          if (comment) {
            // User has already commented
            resolve({ canComment: false })
            return
          }
          
          // Check if user has purchased this product
          db.get(
            `SELECT o.id
             FROM orders o
             JOIN order_items oi ON o.id = oi.order_id
             WHERE o.username = ? AND oi.product_id = ? AND o.status = 'Finished'`,
            [payload.username, productId],
            (err, order) => {
              if (err) {
                reject(createError({
                  statusCode: 500,
                  message: 'Failed to check purchase status'
                }))
                return
              }
              
              // User can comment if they have purchased the product
              resolve({ canComment: !!order })
            }
          )
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