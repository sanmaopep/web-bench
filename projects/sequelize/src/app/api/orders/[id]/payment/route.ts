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
import { Order, OrderItem, Product, User } from '@/model'
import { getLoggedInUser } from '@/actions/auth'
import { sequelize } from '@/libs/db'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const orderId = (await params).id

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
    
    
    // Get the order
    const order = await Order.findOne({
      where: { 
        id: orderId,
        username: currentUser.username,
        status: 'Pending payment'
      },
      transaction
    })
    
    if (!order) {
      await transaction.rollback()
      return NextResponse.json({ 
        success: false, 
        error: 'Order not found or already processed' 
      }, { status: 404 })
    }
    
    // Get the user
    const user = await User.findOne({
      where: { username: currentUser.username },
      transaction
    })
    
    if (!user) {
      await transaction.rollback()
      return NextResponse.json({ 
        success: false, 
        error: 'User not found' 
      }, { status: 404 })
    }
    
    // Check if user has enough coins
    if (user.coin < order.totalPrice) {
      await order.update({ status: 'Failed' }, { transaction })
      await transaction.commit()
      
      return NextResponse.json({ 
        success: false, 
        error: 'Insufficient coins' 
      }, { status: 400 })
    }
    
    // Get order items
    const orderItems = await OrderItem.findAll({
      where: { orderId: order.id },
      transaction
    })
    
    // Update product quantities
    for (const item of orderItems) {
      const product = await Product.findByPk(item.productId, { transaction })
      
      if (!product || product.quantity < item.quantity) {
        await order.update({ status: 'Failed' }, { transaction })
        await transaction.commit()
        
        return NextResponse.json({ 
          success: false, 
          error: 'Product out of stock' 
        }, { status: 400 })
      }
      
      await product.update({
        quantity: product.quantity - item.quantity
      }, { transaction })
    }
    
    // Deduct coins from user
    await user.update({
      coin: user.coin - order.totalPrice
    }, { transaction })
    
    // Update order status
    await order.update({ status: 'Finished' }, { transaction })
    
    // Check if this is user's first order and if they were referred
    if (user.referredBy) {
      // Get the number of orders by this user that are finished
      const finishedOrders = await Order.count({
        where: {
          username: user.username,
          status: 'Finished'
        },
        transaction
      })
      
      // If this is the first finished order, reward the referrer
      if (finishedOrders === 1) {
        const referrer = await User.findOne({
          where: { username: user.referredBy },
          transaction
        })
        
        if (referrer) {
          await referrer.update({
            coin: referrer.coin + 1888
          }, { transaction })
        }
      }
    }
    
    await transaction.commit()
    
    return NextResponse.json({ 
      success: true,
      message: 'Payment successful'
    })
  } catch (error) {
    await transaction.rollback()
    console.error('Payment error:', error)
    
    try {
      const order = await Order.findByPk(orderId)
      if (order) {
        await order.update({ status: 'Failed' })
      }
    } catch (updateError) {
      console.error('Failed to update order status:', updateError)
    }
    
    return NextResponse.json({ 
      success: false, 
      error,
    }, { status: 500 })
  }
}