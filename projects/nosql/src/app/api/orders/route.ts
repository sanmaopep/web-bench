// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//     http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

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
