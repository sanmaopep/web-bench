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
import User from '@/model/user'
import Product from '@/model/product'

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    return new Response(null, { status: 401 })
  }

  const order = await Order.findById((await params).id)

  if (!order || order.username !== currentUser.username) {
    return new Response(null, { status: 403 })
  }

  if (order.status !== 'Pending payment') {
    return new Response(null, { status: 400 })
  }

  const user = await User.findOne({ username: currentUser.username })

  if (!user || user.coin! < order.totalPrice!) {
    await Order.findByIdAndUpdate(order._id, { status: 'Failed' })
    return new Response(null, { status: 400 })
  }

  const products = await Product.find({
    _id: { $in: order.items!.map((i) => i.productId) },
  })
  for (const item of order.items!) {
    const product = products.find((p) => p._id.equals(item.productId))
    if (!product || product?.quantity! < item.quantity) {
      await Order.findByIdAndUpdate(order._id, { status: 'Failed' })
      return new Response(null, { status: 400 })
    }
  }

  try {
    await User.findOneAndUpdate(
      { username: currentUser.username },
      { $inc: { coin: -order.totalPrice! } }
    )

    // Handle referral reward for first order
    const referrer = await User.findOne({
      referralPending: currentUser.username
    })

    if (referrer) {
      await User.findOneAndUpdate(
        { username: referrer.username },
        { 
          $inc: { coin: 1888 },
          $pull: { referralPending: currentUser.username }
        }
      )
    }

    for (const item of order.items!) {
      await Product.findByIdAndUpdate(item.productId, { $inc: { quantity: -item.quantity } })
    }

    await Order.findByIdAndUpdate(order._id, { status: 'Finished' })

    return NextResponse.json({ success: true })
  } catch (error) {
    await Order.findByIdAndUpdate(order._id, { status: 'Failed' })
    return new Response(null, { status: 500 })
  }
}