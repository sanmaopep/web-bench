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
import Comment from '@/model/comment'
import Order from '@/model/order'

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const comments = await Comment.find({ productId: (await params).id }).sort('-createdAt')
  return NextResponse.json(comments)
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const currentUser = await getCurrentUser()
  if (!currentUser) {
    return new Response(null, { status: 401 })
  }

  const orders = await Order.find({
    username: currentUser.username,
    status: 'Finished',
    'items.productId': (await params).id
  })

  if (!orders.length) {
    return new Response(null, { status: 403 })
  }

  const existingComment = await Comment.findOne({
    username: currentUser.username,
    productId: (await params).id
  })

  if (existingComment) {
    return new Response(null, { status: 400 })
  }

  const { rating, text } = await request.json()
  
  const comment = await Comment.create({
    username: currentUser.username,
    productId: (await params).id,
    rating,
    text
  })

  return NextResponse.json(comment)
}