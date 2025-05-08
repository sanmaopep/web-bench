import { NextResponse } from 'next/server'
import { Order, OrderItem, Product } from '@/model'
import { getLoggedInUser } from '@/actions/auth'

export async function GET(
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
        username: currentUser.username
      },
      include: [{
        model: OrderItem,
        as: 'items',
        include: [{
          model: Product,
          as: 'product'
        }]
      }]
    })
    
    if (!order) {
      return NextResponse.json({ 
        success: false, 
        error: 'Order not found' 
      }, { status: 404 })
    }
    
    return NextResponse.json({ 
      success: true, 
      order
    })
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: `Failed to fetch order details: ${error}`
    }, { status: 500 })
  }
}