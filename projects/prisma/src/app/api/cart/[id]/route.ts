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

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const cartItemId = parseInt(params.id);
    const currentUser = await getCurrentUser();
    
    if (!currentUser.username) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    
    // First verify that this cart item belongs to the current user
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: cartItemId },
      select: { username: true }
    });
    
    if (!cartItem || cartItem.username !== currentUser.username) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    
    // Delete the cart item
    await prisma.cartItem.delete({
      where: { id: cartItemId }
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing item from cart:', error);
    return NextResponse.json({ success: false, message: 'Failed to remove item from cart' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const cartItemId = parseInt(params.id);
    const { quantity } = await request.json();
    const currentUser = await getCurrentUser();
    
    if (!currentUser.username) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    
    // First verify that this cart item belongs to the current user
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: cartItemId },
      select: { username: true }
    });
    
    if (!cartItem || cartItem.username !== currentUser.username) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    
    // Update the cart item quantity
    const updatedCartItem = await prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity }
    });
    
    return NextResponse.json({ success: true, data: updatedCartItem });
  } catch (error) {
    console.error('Error updating cart item:', error);
    return NextResponse.json({ success: false, message: 'Failed to update cart item' }, { status: 500 });
  }
}