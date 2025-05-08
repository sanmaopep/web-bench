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
      'SELECT p.* FROM wishlist w JOIN products p ON w.product_id = p.id WHERE w.username = ?',
      [currentUser.username],
      (err, rows) => {
        if (err) {
          resolve(NextResponse.json({ success: false, error: err.message }, { status: 500 }))
        } else {
          resolve(NextResponse.json({ success: true, wishlist: rows }))
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
      'INSERT OR IGNORE INTO wishlist (username, product_id) VALUES (?, ?)',
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
      'DELETE FROM wishlist WHERE username = ? AND product_id = ?',
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
