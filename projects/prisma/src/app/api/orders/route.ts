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

export async function GET() {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser.username) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    
    const orders = await prisma.order.findMany({
      where: {
        username: currentUser.username
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST() {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser.username) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    
    // Get cart items
    const cartItems = await prisma.cartItem.findMany({
      where: {
        username: currentUser.username
      },
      include: {
        product: true
      }
    });
    
    if (cartItems.length === 0) {
      return NextResponse.json({ success: false, message: 'Cart is empty' }, { status: 400 });
    }
    
    // Calculate total price
    const totalPrice = cartItems.reduce(
      (sum, item) => sum + (item.product.price * item.quantity), 
      0
    );
    
    // Create order and order items in a transaction
    const result = await prisma.$transaction(async (prisma) => {
      // Create the order
      const order = await prisma.order.create({
        data: {
          username: currentUser.username,
          status: 'Pending payment',
          totalPrice,
        }
      });
      
      // Create order items
      for (const cartItem of cartItems) {
        await prisma.orderItem.create({
          data: {
            orderId: order.id,
            productId: cartItem.productId,
            quantity: cartItem.quantity,
            price: cartItem.product.price
          }
        });
      }
      
      // Clear the cart
      await prisma.cartItem.deleteMany({
        where: {
          username: currentUser.username
        }
      });
      
      return order;
    });
    
    return NextResponse.json({ 
      success: true, 
      data: { 
        orderId: result.id 
      } 
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to create order' 
    }, { status: 500 });
  }
}