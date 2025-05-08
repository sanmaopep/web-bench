import { NextRequest, NextResponse } from 'next/server'
import db, { runTransaction } from '@/libs/db'
import { getCurrentUser } from '@/actions/auth'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ order_id: string }> }
) {
  const currentUser = await getCurrentUser()

  if (!currentUser || currentUser.role !== 'admin') {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  const { order_id } = await params

  const orderInfo: any = await new Promise((resolve, reject) => {
    db.get(
      'SELECT username, total_price FROM orders WHERE id = ? AND status = ?',
      [order_id, 'Refund Reviewing'],
      (err, row: any) => {
        if (err) reject(err)
        else if (!row) reject(new Error('Order not found or not eligible for refund'))
        else resolve(row)
      }
    )
  })

  try {
    await runTransaction([
      {
        sql: 'UPDATE users SET coin = coin + ? WHERE username = ?',
        deps: [orderInfo.total_price, orderInfo.username],
      },
      {
        sql: 'UPDATE orders SET status = ? WHERE id = ?',
        deps: ['Refund Passed', order_id],
      },
    ])

    return NextResponse.json({ success: true, order_id, orderInfo })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
