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

export async function POST(request: NextRequest) {
  const body = await request.json()

  return new Promise((resolve) => {
    db.run(
      'INSERT INTO products (name, price, image, description, quantity) VALUES (?, ?, ?, ?, ?)',
      [body.name, body.price, body.image, body.description, body.quantity],
      function (err) {
        if (err) {
          resolve(NextResponse.json({ success: false, error: err.message }, { status: 500 }))
        } else {
          resolve(NextResponse.json({ success: true, data: { id: this.lastID } }))
        }
      }
    )
  })
}

export async function GET() {
  return new Promise((resolve) => {
    db.all('SELECT * FROM products', (err, rows) => {
      if (err) {
        resolve(NextResponse.json({ success: false, error: err.message }, { status: 500 }))
      } else {
        resolve(NextResponse.json({ success: true, products: rows }))
      }
    })
  })
}
