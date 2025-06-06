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

import { db, runTransaction } from '~/libs/db'
import { jwtVerify } from 'jose'

interface Order {
  username: string
  status: string
  total_price: number
}

export default defineEventHandler(async (event) => {
  // Verify admin authentication
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
    
    // Check if user is admin
    if (payload.role !== 'admin') {
      throw createError({
        statusCode: 403,
        message: 'Forbidden: Admin access required'
      })
    }

    // First get the order details
    const order = await new Promise<Order>((resolve, reject) => {
      db.get(
        'SELECT username, status, total_price FROM orders WHERE id = ?',
        [orderId],
        (err, row) => {
          if (err) reject(err)
          else resolve(row as Order)
        }
      )
    })

    if (!order) {
      throw createError({
        statusCode: 404,
        message: 'Order not found'
      })
    }
    
    if (order.status !== 'Refund Reviewing') {
      throw createError({
        statusCode: 400,
        message: 'This order is not in refund reviewing status'
      })
    }

    // Prepare transaction operations
    const transactionOps = [
      {
        sql: 'UPDATE orders SET status = ? WHERE id = ?',
        deps: ['Refund Passed', orderId]
      },
      {
        sql: 'UPDATE users SET coin = coin + ? WHERE username = ?',
        deps: [order.total_price, order.username]
      }
    ]

    await runTransaction(transactionOps)
    
    return { success: true }
  } catch (err) {
    if (err instanceof Error) {
      throw createError({
        statusCode: 500,
        message: err.message
      })
    }
    throw createError({
      statusCode: 401,
      message: 'Invalid token or insufficient permissions'
    })
  }
})