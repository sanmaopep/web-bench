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
  id: number
  username: string
  status: string
  total_price: number
}

interface User {
  coin: number
}

interface OrderItem {
  product_id: number
  quantity: number
}

interface Product {
  id: number
  quantity: number
}

interface Referral {
  referrer: string
  first_purchase_rewarded: number
}

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

    // First, get the order
    const order = await new Promise<Order>((resolve, reject) => {
      db.get(
        `SELECT id, username, status, total_price
         FROM orders
         WHERE id = ?`,
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

    // Check if the order belongs to the user
    if (order.username !== payload.username) {
      throw createError({
        statusCode: 403,
        message: 'You do not have permission to pay this order'
      })
    }

    // Check if the order is in the correct status
    if (order.status !== 'Pending payment') {
      throw createError({
        statusCode: 400,
        message: 'This order cannot be paid'
      })
    }

    // Get user coin balance
    const user = await new Promise<User>((resolve, reject) => {
      db.get(
        'SELECT coin FROM users WHERE username = ?',
        [payload.username],
        (err, row) => {
          if (err) reject(err)
          else resolve(row as User)
        }
      )
    })

    // Check if user has enough coins
    if (user.coin < order.total_price) {
      await runTransaction([{
        sql: 'UPDATE orders SET status = ? WHERE id = ?',
        deps: ['Failed', orderId]
      }])
      return {
        success: false,
        message: 'Insufficient funds'
      }
    }

    // Get order items to update product quantities
    const items = await new Promise<OrderItem[]>((resolve, reject) => {
      db.all(
        `SELECT product_id, quantity FROM order_items WHERE order_id = ?`,
        [orderId],
        (err, rows) => {
          if (err) reject(err)
          else resolve(rows as OrderItem[])
        }
      )
    })

    // Check product quantities
    const products = await Promise.all(
      items.map(item => 
        new Promise<Product>((resolve, reject) => {
          db.get(
            'SELECT id, quantity FROM products WHERE id = ?',
            [item.product_id],
            (err, row) => {
              if (err) reject(err)
              else resolve(row as Product)
            }
          )
        })
      )
    )

    // Check if any product has insufficient stock
    const insufficientStock = products.some((product, index) => 
      !product || product.quantity < items[index].quantity
    )

    if (insufficientStock) {
      await runTransaction([{
        sql: 'UPDATE orders SET status = ? WHERE id = ?',
        deps: ['Failed', orderId]
      }])
      return {
        success: false,
        message: 'Insufficient stock for one or more products'
      }
    }

    // Check if this is the user's first purchase and they were referred
    const referral = await new Promise<Referral | null>((resolve, reject) => {
      db.get(
        'SELECT referrer, first_purchase_rewarded FROM referrals WHERE referred = ? AND first_purchase_rewarded = 0',
        [payload.username],
        (err, row) => {
          if (err) reject(err)
          else resolve(row as Referral | null)
        }
      )
    })

    // Prepare transaction operations
    const transactionOps = [
      // Update user's coin balance
      {
        sql: 'UPDATE users SET coin = coin - ? WHERE username = ?',
        deps: [order.total_price, payload.username]
      },
      // Update product quantities
      ...items.map(item => ({
        sql: 'UPDATE products SET quantity = quantity - ? WHERE id = ?',
        deps: [item.quantity, item.product_id]
      })),
      // Update order status to finished
      {
        sql: 'UPDATE orders SET status = ? WHERE id = ?',
        deps: ['Finished', orderId]
      }
    ]

    // If this is the user's first purchase and they were referred, add the bonus to the referrer
    if (referral) {
      transactionOps.push({
        sql: 'UPDATE users SET coin = coin + 1888 WHERE username = ?',
        deps: [referral.referrer]
      })
      
      transactionOps.push({
        sql: 'UPDATE referrals SET first_purchase_rewarded = 1 WHERE referred = ?',
        deps: [payload.username]
      })
    }

    await runTransaction(transactionOps)

    return {
      success: true,
      message: 'Payment successful'
    }
  } catch (err) {
    if (err instanceof Error) {
      throw createError({
        statusCode: 500,
        message: err.message
      })
    }
    throw createError({
      statusCode: 401,
      message: 'Invalid token'
    })
  }
})