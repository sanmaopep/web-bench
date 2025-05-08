import { NextResponse } from 'next/server'
import { Order, OrderItem, Cart, Product } from '@/model'
import { getLoggedInUser } from '@/actions/auth'
import { sequelize } from '@/libs/db'

export async function GET() {
  try {
    const currentUser = await getLoggedInUser()
    
    if (!currentUser) {
      return NextResponse.json({ 
        success: false, 
        error: 'Unauthorized' 
      }, { status: 401 })
    }
    
    const orders = await Order.findAll({
      where: { username: currentUser.username },
      order: [['createdAt', 'DESC']]
    })
    
    return NextResponse.json({ 
      success: true, 
      orders
    })
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch orders' 
    }, { status: 500 })
  }
}

export async function POST() {
  const transaction = await sequelize.transaction()
  
  try {
    const currentUser = await getLoggedInUser()
    
    if (!currentUser) {
      await transaction.rollback()
      return NextResponse.json({ 
        success: false, 
        error: 'Unauthorized' 
      }, { status: 401 })
    }
    
    // Get cart items
    const cartItems = await Cart.findAll({
      where: { username: currentUser.username },
      include: [{
        model: Product,
        as: 'product'
      }],
      transaction
    })
    
    if (cartItems.length === 0) {
      await transaction.rollback()
      return NextResponse.json({ 
        success: false, 
        error: 'Cart is empty' 
      }, { status: 400 })
    }
    
    // Calculate total price
    const totalPrice = cartItems.reduce((sum, item) => {
      return sum + (item.product.price * item.quantity)
    }, 0)
    
    // Create order
    const order = await Order.create({
      username: currentUser.username,
      totalPrice,
      status: 'Pending payment'
    }, { transaction })
    
    // Create order items
    await Promise.all(cartItems.map(item => {
      return OrderItem.create({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.product.price
      }, { transaction })
    }))
    
    // Clear cart
    await Cart.destroy({
      where: { username: currentUser.username },
      transaction
    })
    
    await transaction.commit()
    
    return NextResponse.json({ 
      success: true, 
      orderId: order.id
    })
  } catch (error) {
    await transaction.rollback()
    return NextResponse.json({ 
      success: false, 
      error,
    }, { status: 500 })
  }
}