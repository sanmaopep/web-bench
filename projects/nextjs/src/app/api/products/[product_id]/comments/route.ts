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
import db from '@/libs/db'
import { getCurrentUser } from '@/actions/auth'

async function getHasPurchased(username: string, product_id: string) {
  return new Promise((resolve) => {
    db.get(
      'SELECT 1 FROM orders o JOIN order_items oi ON o.id = oi.order_id WHERE o.username = ? AND oi.product_id = ? AND o.status = "Finished" LIMIT 1',
      [username, product_id],
      (err, row) => {
        if (err) {
          resolve(false)
        } else {
          resolve(Boolean(row))
        }
      }
    )
  })
}

async function getHasCommented(username: string, product_id: string) {
  return new Promise((resolve) => {
    db.get(
      'SELECT 1 FROM comments WHERE user_id = (SELECT id FROM users WHERE username =?) AND product_id =? LIMIT 1',
      [username, product_id],
      (err, row) => {
        if (err) {
          resolve(false)
        } else {
          resolve(Boolean(row))
        }
      }
    )
  })
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ product_id: string }> }
) {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  const { product_id } = await params

  const [hasPurchased, hasCommented] = await Promise.all([
    getHasPurchased(currentUser.username, product_id),
    getHasCommented(currentUser.username, product_id),
  ])

  return new Promise((resolve) => {
    db.all(
      'SELECT c.*, u.username FROM comments c JOIN users u ON c.user_id = u.id WHERE c.product_id = ?',
      [product_id],
      (err, rows) => {
        if (err) {
          resolve(NextResponse.json({ success: false, error: err.message }, { status: 500 }))
        } else {
          resolve(
            NextResponse.json({
              success: true,
              comments: rows,
              canComment: hasPurchased && !hasCommented,
            })
          )
        }
      }
    )
  })
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ product_id: string }> }
) {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  const { product_id } = await params
  const { rating, comment } = await request.json()

  const [hasPurchased, hasCommented] = await Promise.all([
    getHasPurchased(currentUser.username, product_id),
    getHasCommented(currentUser.username, product_id),
  ])

  if (!hasPurchased) {
    return NextResponse.json(
      { success: false, error: 'You must purchase the product before commenting' },
      { status: 403 }
    )
  }

  if (hasCommented) {
    return NextResponse.json(
      { success: false, error: 'You have commented this product' },
      { status: 403 }
    )
  }

  return new Promise((resolve) => {
    db.run(
      'INSERT INTO comments (user_id, product_id, rating, comment) VALUES ((SELECT id FROM users WHERE username = ?), ?, ?, ?)',
      [currentUser.username, product_id, rating, comment],
      (err) => {
        if (err) {
          resolve(NextResponse.json({ success: false, error: err.message }, { status: 500 }))
        } else {
          resolve(NextResponse.json({ success: true }))
        }
      }
    )
  })
}
