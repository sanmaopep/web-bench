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
import { Comment, Order, OrderItem, Product } from '@/model'
import { getLoggedInUser } from '@/actions/auth'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const productId = (await params).id
    
    const comments = await Comment.findAll({
      where: { productId },
      order: [['createdAt', 'DESC']]
    })
    
    return NextResponse.json({
      success: true,
      comments
    })
  } catch (error) {
    console.error('Error fetching comments:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch comments' 
    }, { status: 500 })
  }
}

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
    
    const productId = (await params).id
    const { rating, comment } = await request.json()
    
    // Check if product exists
    const product = await Product.findByPk(productId)
    if (!product) {
      return NextResponse.json({ 
        success: false, 
        error: 'Product not found' 
      }, { status: 404 })
    }
    
    // Check if user has purchased this product
    const hasPurchased = await OrderItem.findOne({
      where: { productId },
      include: [{
        model: Order,
        where: { 
          username: currentUser.username,
          status: 'Finished'
        }
      }]
    })
    
    if (!hasPurchased) {
      return NextResponse.json({ 
        success: false, 
        error: 'You must purchase this product before leaving a comment' 
      }, { status: 403 })
    }
    
    // Check if user has already commented on this product
    const existingComment = await Comment.findOne({
      where: {
        username: currentUser.username,
        productId
      }
    })
    
    if (existingComment) {
      return NextResponse.json({ 
        success: false, 
        error: 'You have already commented on this product' 
      }, { status: 400 })
    }
    
    // Create the comment
    const newComment = await Comment.create({
      username: currentUser.username,
      productId,
      rating,
      comment
    })
    
    return NextResponse.json({
      success: true,
      comment: newComment
    })
  } catch (error) {
    console.error('Error creating comment:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to create comment' 
    }, { status: 500 })
  }
}