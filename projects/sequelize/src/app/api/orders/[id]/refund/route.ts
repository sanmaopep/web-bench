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
import { Order } from '@/model'
import { getLoggedInUser } from '@/actions/auth'

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
    
    const orderId = (await params).id
    
    const order = await Order.findOne({
      where: { 
        id: orderId,
        username: currentUser.username,
        status: 'Finished'
      }
    })
    
    if (!order) {
      return NextResponse.json({ 
        success: false, 
        error: 'Order not found or cannot be refunded' 
      }, { status: 404 })
    }
    
    // Update order status to "Refund Reviewing"
    await order.update({ status: 'Refund Reviewing' })
    
    return NextResponse.json({ 
      success: true,
      message: 'Refund request submitted successfully'
    })
  } catch (error) {
    console.error('Refund request error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to process refund request' 
    }, { status: 500 })
  }
}