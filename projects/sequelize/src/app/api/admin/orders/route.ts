import { NextResponse } from 'next/server'
import { Order, OrderItem, Product } from '@/model'
import { getLoggedInUser } from '@/actions/auth'

export async function GET() {
  try {
    const currentUser = await getLoggedInUser()
    
    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json({ 
        success: false, 
        error: 'Unauthorized' 
      }, { status: 401 })
    }
    
    const orders = await Order.findAll({
      include: [{
        model: OrderItem,
        as: 'items',
        include: [{
          model: Product,
          as: 'product',
          attributes: ['id', 'name']
        }]
      }],
      order: [['createdAt', 'DESC']]
    })
    
    return NextResponse.json({ 
      success: true, 
      orders
    })
  } catch (error) {
    console.error('Error fetching admin orders:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch orders' 
    }, { status: 500 })
  }
}