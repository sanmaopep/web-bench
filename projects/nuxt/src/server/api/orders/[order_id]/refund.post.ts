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
  const orderId = event.context.params?.order_id
  
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
      // First get the order
      db.get(
        'SELECT id, username, status FROM orders WHERE id = ?',
        [orderId],
        (err, order) => {
          if (err) {
            reject(createError({
              statusCode: 500,
              message: 'Failed to fetch order'
            }))
            return
          }
          
          if (!order) {
            reject(createError({
              statusCode: 404,
              message: 'Order not found'
            }))
            return
          }
          
          // Check if the order belongs to the user
          if (order.username !== payload.username) {
            reject(createError({
              statusCode: 403,
              message: 'You do not have permission to refund this order'
            }))
            return
          }
          
          // Check if the order is in the correct status
          if (order.status !== 'Finished') {
            reject(createError({
              statusCode: 400,
              message: 'This order cannot be refunded'
            }))
            return
          }
          
          // Update order status to 'Refund Reviewing'
          db.run(
            'UPDATE orders SET status = ? WHERE id = ?',
            ['Refund Reviewing', orderId],
            function(err) {
              if (err) {
                reject(createError({
                  statusCode: 500,
                  message: 'Failed to update order status'
                }))
                return
              }
              
              resolve({ success: true })
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