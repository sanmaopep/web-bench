import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/actions/auth'
import Order from '@/model/order'

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    return new Response(null, { status: 401 })
  }

  const order = await Order.findById((await params).id)

  if (!order || order.username !== currentUser.username || order.status !== 'Finished') {
    return new Response(null, { status: 400 })
  }

  await Order.findByIdAndUpdate(order._id, { status: 'Refund Reviewing' })

  return NextResponse.json({ success: true })
}