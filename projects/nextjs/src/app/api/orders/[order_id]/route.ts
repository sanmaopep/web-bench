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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ order_id: string }> }
) {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  const { order_id } = await params

  return new Promise((resolve) => {
    db.get(
      `SELECT o.*, json_group_array(json_object('id', p.id, 'name', p.name, 'price', p.price, 'image', p.image, 'quantity', oi.quantity)) as products
       FROM orders o
       JOIN order_items oi ON o.id = oi.order_id
       JOIN products p ON oi.product_id = p.id
       WHERE o.id = ? AND o.username = ?
       GROUP BY o.id`,
      [order_id, currentUser.username],
      (err, row: any) => {
        if (err) {
          resolve(NextResponse.json({ success: false, error: err.message }, { status: 500 }))
        } else if (row) {
          row.products = JSON.parse(row.products)
          resolve(NextResponse.json({ success: true, order: row }))
        } else {
          resolve(NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 }))
        }
      }
    )
  })
}
