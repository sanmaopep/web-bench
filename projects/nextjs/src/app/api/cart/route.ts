import { NextRequest, NextResponse } from 'next/server'
import db from '@/libs/db'
import { getCurrentUser } from '@/actions/auth'

export async function GET(request: NextRequest) {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  return new Promise((resolve) => {
    db.all(
      'SELECT c.product_id, c.quantity, p.name, p.price, p.image FROM cart c JOIN products p ON c.product_id = p.id WHERE c.username = ?',
      [currentUser.username],
      (err, rows) => {
        if (err) {
          resolve(NextResponse.json({ success: false, error: err.message }, { status: 500 }))
        } else {
          resolve(NextResponse.json({ success: true, cart: rows }))
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

  const { product_id } = await request.json()

  return new Promise((resolve) => {
    db.run(
      'INSERT INTO cart (username, product_id, quantity) VALUES (?, ?, 1) ON CONFLICT(username, product_id) DO UPDATE SET quantity = quantity + 1',
      [currentUser.username, product_id],
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

export async function DELETE(request: NextRequest) {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  const { product_id } = await request.json()

  return new Promise((resolve) => {
    db.run(
      'DELETE FROM cart WHERE username = ? AND product_id = ?',
      [currentUser.username, product_id],
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
