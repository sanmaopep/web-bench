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
    const { productId } = await readBody(event)
    
    if (!productId) {
      throw createError({
        statusCode: 400,
        message: 'Product ID is required'
      })
    }
    
    return new Promise((resolve, reject) => {
      // First check if the product exists
      db.get('SELECT id FROM products WHERE id = ?', [productId], (err, product) => {
        if (err || !product) {
          reject(createError({
            statusCode: 404,
            message: 'Product not found'
          }))
          return
        }
        
        // Then add to wishlist
        db.run(
          'INSERT OR IGNORE INTO wishlist (username, product_id) VALUES (?, ?)',
          [payload.username, productId],
          function(err) {
            if (err) {
              reject(createError({
                statusCode: 500,
                message: 'Failed to add to wishlist'
              }))
              return
            }
            
            resolve({ success: true })
          }
        )
      })
    })
  } catch (err) {
    throw createError({
      statusCode: 401,
      message: 'Invalid token'
    })
  }
})