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
