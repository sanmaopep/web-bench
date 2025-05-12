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
import { Cart, Product } from '@/model'
import { getLoggedInUser } from '@/actions/auth'

export async function GET() {
  try {
    const currentUser = await getLoggedInUser()
    
    if (!currentUser) {
      return NextResponse.json({ 
        success: false, 
        error: 'Unauthorized' 
      }, { status: 401 })
    }
    
    const cartItems = await Cart.findAll({
      where: { username: currentUser.username },
      include: [{
        model: Product,
        as: 'product'
      }]
    })
    
    return NextResponse.json({ 
      success: true, 
      items: cartItems 
    })
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch cart items' 
    }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const currentUser = await getLoggedInUser()
    
    if (!currentUser) {
      return NextResponse.json({ 
        success: false, 
        error: 'Unauthorized' 
      }, { status: 401 })
    }
    
    const { productId, quantity = 1 } = await request.json()
    
    // Check if product exists
    const product = await Product.findByPk(productId)
    
    if (!product) {
      return NextResponse.json({ 
        success: false, 
        error: 'Product not found' 
      }, { status: 404 })
    }
    
    // Check if product is in stock
    if (product.quantity < quantity) {
      return NextResponse.json({ 
        success: false, 
        error: 'Product out of stock' 
      }, { status: 400 })
    }
    
    // Check if item already in cart
    const existingItem = await Cart.findOne({
      where: {
        username: currentUser.username,
        productId
      }
    })
    
    if (existingItem) {
      // Update quantity
      await existingItem.update({
        quantity: existingItem.quantity + quantity
      })
      
      return NextResponse.json({ 
        success: true,
        item: existingItem
      })
    } else {
      // Create new cart item
      const newItem = await Cart.create({
        username: currentUser.username,
        productId,
        quantity
      })
      
      return NextResponse.json({ 
        success: true,
        item: newItem
      })
    }
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: `Failed to add to cart: ${error}` 
    }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const currentUser = await getLoggedInUser()
    
    if (!currentUser) {
      return NextResponse.json({ 
        success: false, 
        error: 'Unauthorized' 
      }, { status: 401 })
    }
    
    const { productId } = await request.json()
    
    const deleted = await Cart.destroy({
      where: {
        username: currentUser.username,
        productId
      }
    })
    
    return NextResponse.json({ 
      success: true,
      deleted: deleted > 0
    })
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to remove from cart' 
    }, { status: 500 })
  }
}