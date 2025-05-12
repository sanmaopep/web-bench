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
