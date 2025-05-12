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
  
  if (!cookie) {
    throw createError({
      statusCode: 401,
      message: 'Not authenticated'
    })
  }
  
  try {
    const secret = new TextEncoder().encode('WEBBENCH-SECRET')
    const { payload } = await jwtVerify(cookie, secret)
    const { productId, rating, comment } = await readBody(event)
    
    if (!productId) {
      throw createError({
        statusCode: 400,
        message: 'Product ID is required'
      })
    }
    
    if (!rating || rating < 1 || rating > 5) {
      throw createError({
        statusCode: 400,
        message: 'Rating must be between 1 and 5'
      })
    }
    
    if (!comment) {
      throw createError({
        statusCode: 400,
        message: 'Comment text is required'
      })
    }
    
    return new Promise((resolve, reject) => {
      // First check if user has already commented on this product
      db.get(
        'SELECT id FROM comments WHERE username = ? AND product_id = ?',
        [payload.username, productId],
        (err, existingComment) => {
          if (err) {
            reject(createError({
              statusCode: 500,
              message: 'Failed to check existing comments'
            }))
            return
          }
          
          if (existingComment) {
            reject(createError({
              statusCode: 400,
              message: 'You have already reviewed this product'
            }))
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
              
              if (!order) {
                reject(createError({
                  statusCode: 403,
                  message: 'You must purchase this product before reviewing it'
                }))
                return
              }
              
              // Insert the comment
              db.run(
                'INSERT INTO comments (username, product_id, rating, comment, created_at) VALUES (?, ?, ?, ?, datetime("now"))',
                [payload.username, productId, rating, comment],
                function(err) {
                  if (err) {
                    reject(createError({
                      statusCode: 500,
                      message: 'Failed to submit comment'
                    }))
                    return
                  }
                  
                  resolve({ 
                    success: true,
                    id: this.lastID
                  })
                }
              )
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