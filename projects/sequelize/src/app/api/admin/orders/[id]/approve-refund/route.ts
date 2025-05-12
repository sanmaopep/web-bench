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
import { Order, User } from '@/model'
import { getLoggedInUser } from '@/actions/auth'
import { sequelize } from '@/libs/db'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const transaction = await sequelize.transaction()

  try {
    const currentUser = await getLoggedInUser()
    
    if (!currentUser || currentUser.role !== 'admin') {
      await transaction.rollback()
      return NextResponse.json({ 
        success: false, 
        error: 'Unauthorized' 
      }, { status: 401 })
    }
    
    const orderId = (await params).id
    
    // Get the order with status "Refund Reviewing"
    const order = await Order.findOne({
      where: { 
        id: orderId,
        status: 'Refund Reviewing'
      },
      transaction
    })
    
    if (!order) {
      await transaction.rollback()
      return NextResponse.json({ 
        success: false, 
        error: 'Order not found or not in review status' 
      }, { status: 404 })
    }
    
    // Get the user to refund coins to
    const user = await User.findOne({
      where: { username: order.username },
      transaction
    })
    
    if (!user) {
      await transaction.rollback()
      return NextResponse.json({ 
        success: false, 
        error: 'User not found' 
      }, { status: 404 })
    }
    
    // Update user's coin balance
    await user.update({
      coin: user.coin + order.totalPrice
    }, { transaction })
    
    // Update order status
    await order.update({ 
      status: 'Refund Passed' 
    }, { transaction })
    
    await transaction.commit()
    
    return NextResponse.json({ 
      success: true,
      message: 'Refund approved successfully'
    })
  } catch (error) {
    await transaction.rollback()
    console.error('Refund approval error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to process refund approval' 
    }, { status: 500 })
  }
}