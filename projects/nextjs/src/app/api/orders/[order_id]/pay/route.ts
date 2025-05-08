import { NextRequest, NextResponse } from 'next/server'
import db, { runTransaction } from '@/libs/db'
import { getCurrentUser } from '@/actions/auth'
import { creditReferrerForFirstPayment } from '@/actions/referer'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ order_id: string }> }
) {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  const { order_id } = await params

  try {
    // Check order exists and user has enough coins
    const orderAndUser = await new Promise<{ total_price: number; coin: number }>(
      (resolve, reject) => {
        db.get(
          'SELECT orders.total_price, users.coin FROM orders JOIN users ON orders.username = users.username WHERE orders.id = ? AND orders.username = ? AND orders.status = ?',
          [order_id, currentUser.username, 'Pending payment'],
          (err, row) => {
            if (err) reject(err)
            else resolve(row as any)
          }
        )
      }
    )

    if (!orderAndUser) {
      return NextResponse.json(
        { success: false, error: 'Order not found or already paid' },
        { status: 404 }
      )
    }

    if (orderAndUser.coin < orderAndUser.total_price) {
      await new Promise<void>((resolve, reject) => {
        db.run('UPDATE orders SET status = ? WHERE id = ?', ['Failed', order_id], (err) => {
          if (err) reject(err)
          else resolve()
        })
      })
      return NextResponse.json({ success: false, error: 'Insufficient funds' }, { status: 400 })
    }

    // Check product quantities
    const items = await new Promise<
      { product_id: number; available_quantity: number; order_quantity: number }[]
    >((resolve, reject) => {
      db.all(
        `SELECT p.id as product_id, p.quantity as available_quantity, oi.quantity as order_quantity 
         FROM order_items oi 
         JOIN products p ON oi.product_id = p.id 
         WHERE oi.order_id = ?`,
        [order_id],
        (err, rows) => {
          if (err) reject(err)
          else resolve(rows as any)
        }
      )
    })

    const insufficientProducts = items.filter(
      (item) => item.available_quantity < item.order_quantity
    )

    if (insufficientProducts.length > 0) {
      await new Promise<void>((resolve, reject) => {
        db.run('UPDATE orders SET status = ? WHERE id = ?', ['Failed', order_id], (err) => {
          if (err) reject(err)
          else resolve()
        })
      })
      return NextResponse.json(
        { success: false, error: 'Some products are out of stock' },
        { status: 400 }
      )
    }

    // Use runTransaction for the transaction operations
    await runTransaction([
      // Update user's coins
      {
        sql: 'UPDATE users SET coin = coin -? WHERE username =?',
        deps: [orderAndUser.total_price, currentUser.username],
      },
      // Update product quantities
      ...items.map((item) => ({
        sql: 'UPDATE products SET quantity = quantity -? WHERE id =?',
        deps: [item.order_quantity, item.product_id],
      })),
      // Update order status
      {
        sql: 'UPDATE orders SET status =? WHERE id =?',
        deps: ['Finished', order_id],
      },
    ])

    await creditReferrerForFirstPayment(currentUser.username)

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
