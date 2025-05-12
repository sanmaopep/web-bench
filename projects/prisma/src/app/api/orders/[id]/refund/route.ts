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

import { prisma } from '@/libs/db';
import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/actions/auth';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = parseInt(params.id);
    const currentUser = await getCurrentUser();
    
    if (!currentUser.username) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    
    // Check if order exists and belongs to the current user
    const order = await prisma.order.findUnique({
      where: { id: orderId }
    });
    
    if (!order) {
      return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
    }
    
    if (order.username !== currentUser.username) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    
    if (order.status !== 'Finished') {
      return NextResponse.json(
        { success: false, message: 'Only finished orders can be refunded' }, 
        { status: 400 }
      );
    }
    
    // Update order status to refund reviewing
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status: 'Refund Reviewing' }
    });
    
    return NextResponse.json({ success: true, data: updatedOrder });
  } catch (error) {
    console.error('Error requesting refund:', error);
    return NextResponse.json({ success: false, message: 'Failed to request refund' }, { status: 500 });
  }
}