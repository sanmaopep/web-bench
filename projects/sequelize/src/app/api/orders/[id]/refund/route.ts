import { NextResponse } from 'next/server'
import { Order } from '@/model'
import { getLoggedInUser } from '@/actions/auth'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await getLoggedInUser()
    
    if (!currentUser) {
      return NextResponse.json({ 
        success: false, 
        error: 'Unauthorized' 
      }, { status: 401 })
    }
    
    const orderId = (await params).id
    
    const order = await Order.findOne({
      where: { 
        id: orderId,
        username: currentUser.username,
        status: 'Finished'
      }
    })
    
    if (!order) {
      return NextResponse.json({ 
        success: false, 
        error: 'Order not found or cannot be refunded' 
      }, { status: 404 })
    }
    
    // Update order status to "Refund Reviewing"
    await order.update({ status: 'Refund Reviewing' })
    
    return NextResponse.json({ 
      success: true,
      message: 'Refund request submitted successfully'
    })
  } catch (error) {
    console.error('Refund request error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to process refund request' 
    }, { status: 500 })
  }
}