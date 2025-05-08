import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/actions/auth'
import Order from '@/model/order'
import User from '@/model/user'

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const currentUser = await getCurrentUser()

  if (!currentUser || currentUser.role !== 'admin') {
    return new Response(null, { status: 401 })
  }

  const order = await Order.findById((await params).id)

  if (!order || order.status !== 'Refund Reviewing') {
    return new Response(null, { status: 400 })
  }

  try {
    // Refund coins
    await User.findOneAndUpdate(
      { username: order.username },
      { $inc: { coin: order.totalPrice } }
    )

    // Update order status
    await Order.findByIdAndUpdate(order._id, { status: 'Refund Passed' })

    return NextResponse.json({ success: true })
  } catch (error) {
    return new Response(null, { status: 500 })
  }
}