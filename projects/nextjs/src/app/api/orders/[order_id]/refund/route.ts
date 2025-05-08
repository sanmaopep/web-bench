import { NextRequest, NextResponse } from 'next/server'
import db from '@/libs/db'
import { getCurrentUser } from '@/actions/auth'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ order_id: string }> }
) {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  const { order_id } = await params

  return new Promise((resolve) => {
    db.run(
      'UPDATE orders SET status = ? WHERE id = ? AND username = ? AND status = ?',
      ['Refund Reviewing', order_id, currentUser.username, 'Finished'],
      function (err) {
        if (err) {
          resolve(NextResponse.json({ success: false, error: err.message }, { status: 500 }))
        } else if (this.changes > 0) {
          resolve(NextResponse.json({ success: true }))
        } else {
          resolve(
            NextResponse.json(
              { success: false, error: 'Order not found or not eligible for refund' },
              { status: 404 }
            )
          )
        }
      }
    )
  })
}
