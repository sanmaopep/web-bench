import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/actions/auth'
import Order from '@/model/order'
import Cart from '@/model/cart'
import Product from '@/model/product'

export async function GET() {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    return new Response(null, { status: 401 })
  }

  const orders = await Order.find({ username: currentUser.username }).sort({ createdAt: -1 })
  return NextResponse.json(orders)
}

export async function POST() {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    return new Response(null, { status: 401 })
  }

  const cart = await Cart.findOne({ username: currentUser.username }).populate('items.productId')

  if (!cart || !cart.items || cart.items.length === 0) {
    return new Response(null, { status: 400 })
  }

  const orderItems = await Promise.all(
    cart.items.map(async (item) => {
      const product = await Product.findById(item.productId)
      return {
        productId: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: item.quantity,
      }
    })
  )

  const totalPrice = orderItems.reduce((total, item) => total + item.price * item.quantity, 0)

  const order = await Order.create({
    username: currentUser.username,
    items: orderItems,
    totalPrice,
    status: 'Pending payment',
  })

  await Cart.findOneAndDelete({ username: currentUser.username })

  return NextResponse.json({ orderId: String(order._id) })
}
