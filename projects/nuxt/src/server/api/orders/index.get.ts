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
    
    return new Promise((resolve, reject) => {
      // Get all orders for the user
      db.all(
        `SELECT o.id, o.status, o.created_at, o.total_price,
         (SELECT COUNT(*) FROM order_items WHERE order_id = o.id) as item_count,
         (SELECT GROUP_CONCAT(oi.product_id || ',' || oi.quantity || ',' || p.name || ',' || p.price || ',' || p.image)
          FROM order_items oi 
          JOIN products p ON oi.product_id = p.id 
          WHERE oi.order_id = o.id) as items_data
         FROM orders o
         WHERE o.username = ?
         ORDER BY o.created_at DESC`,
        [payload.username],
        (err, rows) => {
          if (err) {
            reject(createError({
              statusCode: 500,
              message: 'Failed to fetch orders'
            }))
            return
          }
          
          // Process the result to format the items data
          const orders = rows.map(order => {
            const items = []
            if (order.items_data) {
              const itemsArray = order.items_data.split(',')
              for (let i = 0; i < itemsArray.length; i += 5) {
                items.push({
                  product_id: parseInt(itemsArray[i]),
                  quantity: parseInt(itemsArray[i + 1]),
                  name: itemsArray[i + 2],
                  price: parseFloat(itemsArray[i + 3]),
                  image: itemsArray[i + 4]
                })
              }
            }
            
            return {
              id: order.id,
              status: order.status,
              created_at: order.created_at,
              total_price: order.total_price,
              items: items
            }
          })
          
          resolve({ orders })
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