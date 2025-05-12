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

import { NextRequest, NextResponse } from 'next/server'
import db, { runTransaction } from '@/libs/db'
import { getCurrentUser } from '@/actions/auth'

export async function GET(request: NextRequest) {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  return new Promise((resolve) => {
    db.all(
      'SELECT * FROM orders WHERE username = ? ORDER BY created_at DESC',
      [currentUser.username],
      (err, rows) => {
        if (err) {
          resolve(NextResponse.json({ success: false, error: err.message }, { status: 500 }))
        } else {
          resolve(NextResponse.json({ success: true, orders: rows }))
        }
      }
    )
  })
}

export async function POST(request: NextRequest) {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  let cartItems: any[] = await new Promise((resolve, reject) => {
    db.all(
      'SELECT c.product_id, c.quantity, p.name, p.price, p.image FROM cart c JOIN products p ON c.product_id = p.id WHERE c.username = ?',
      [currentUser.username],
      (err, rows) => {
        if (err) {
          reject(err)
        } else {
          resolve(rows)
        }
      }
    )
  })

  let orderId: number = -1

  try {
    await runTransaction([
      {
        sql: 'INSERT INTO orders (username, status, total_price) VALUES (?, ?, ?)',
        deps: [
          currentUser.username,
          'Pending payment',
          cartItems.reduce((total, item) => total + item.price * item.quantity, 0),
        ],
        afterCb: (lastID) => {
          orderId = lastID
        },
      },
      ...cartItems.map((item) => () => ({
        sql: 'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
        deps: [orderId, item.product_id, item.quantity, item.price],
      })),
      {
        sql: 'DELETE FROM cart WHERE username = ?',
        deps: [currentUser.username],
      },
    ])

    return NextResponse.json({ success: true, orderId })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
