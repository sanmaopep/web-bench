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

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const productId = parseInt(params.id);
    const currentUser = await getCurrentUser();
    
    if (!currentUser.username) {
      return NextResponse.json({ 
        canComment: false,
        hasCommented: false,
        message: 'User not authenticated' 
      });
    }
    
    // Check if the user has already commented on this product
    const existingComment = await prisma.productComment.findFirst({
      where: {
        username: currentUser.username,
        productId
      }
    });
    
    if (existingComment) {
      return NextResponse.json({ 
        canComment: false,
        hasCommented: true,
        message: 'User has already commented on this product' 
      });
    }
    
    // Check if user has purchased this product
    const completedOrders = await prisma.order.findMany({
      where: {
        username: currentUser.username,
        status: 'Finished'
      },
      include: {
        orderItems: {
          where: {
            productId
          }
        }
      }
    });
    
    // Filter orders that contain this product
    const ordersWithProduct = completedOrders.filter(order => order.orderItems.length > 0);
    
    return NextResponse.json({ 
      canComment: ordersWithProduct.length > 0,
      hasCommented: false,
      message: ordersWithProduct.length > 0 ? 'User can comment' : 'User has not purchased this product'
    });
  } catch (error) {
    console.error('Error checking comment eligibility:', error);
    return NextResponse.json(
      { canComment: false, hasCommented: false, message: 'Error checking comment eligibility' },
      { status: 500 }
    );
  }
}