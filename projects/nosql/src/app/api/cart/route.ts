import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/actions/auth'
import Cart from '@/model/cart'
import Product from '@/model/product'

export async function GET() {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    return new Response(null, { status: 401 })
  }

  const cart = await Cart.findOne({ username: currentUser.username })
  if (!cart) {
    return NextResponse.json({ items: [] })
  }

  const items = await Promise.all(
    cart.items.map(async (item) => {
      const product = await Product.findById(item.productId)
      return {
        _id: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: item.quantity,
      }
    })
  )

  return NextResponse.json({ items })
}

export async function POST(request: Request) {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    return new Response(null, { status: 401 })
  }

  const { productId } = await request.json()

  let cart = await Cart.findOne({ username: currentUser.username })

  if (!cart) {
    cart = await Cart.create({
      username: currentUser.username,
      items: [{ productId, quantity: 1 }],
    })
  } else {
    const existingItem = cart.items!.find((item) => item.productId.toString() === productId)

    if (existingItem) {
      existingItem.quantity += 1
    } else {
      cart.items!.push({ productId, quantity: 1 })
    }
    await cart.save()
  }

  return NextResponse.json({ success: true })
}

export async function DELETE(request: Request) {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    return new Response(null, { status: 401 })
  }

  const { productId } = await request.json()

  await Cart.findOneAndUpdate(
    { username: currentUser.username },
    { $pull: { items: { productId } } }
  )

  return NextResponse.json({ success: true })
}
