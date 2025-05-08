import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/actions/auth'
import Order from '@/model/order'

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    return new Response(null, { status: 401 })
  }

  const order = await Order.findById((await params).id)

  if (!order || (currentUser.role !== 'admin' && order.username !== currentUser.username)) {
    return new Response(null, { status: 403 })
  }

  return NextResponse.json(order)
}
