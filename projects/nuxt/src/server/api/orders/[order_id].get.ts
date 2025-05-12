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
      // First, get the order
      db.get(
        `SELECT id, username, status, created_at, total_price
         FROM orders
         WHERE id = ?`,
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
          
          // Check if the order belongs to the user or user is admin
          if (order.username !== payload.username && payload.role !== 'admin') {
            reject(createError({
              statusCode: 403,
              message: 'You do not have permission to view this order'
            }))
            return
          }
          
          // Now get the order items
          db.all(
            `SELECT oi.product_id, oi.quantity, p.name, p.price, p.image
             FROM order_items oi
             JOIN products p ON oi.product_id = p.id
             WHERE oi.order_id = ?`,
            [orderId],
            (err, items) => {
              if (err) {
                reject(createError({
                  statusCode: 500,
                  message: 'Failed to fetch order items'
                }))
                return
              }
              
              // Combine order with its items
              order.items = items
              
              resolve({ order })
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