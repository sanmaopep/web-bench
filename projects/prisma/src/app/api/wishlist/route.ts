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
    
    const wishlist = await prisma.wishlistItem.findMany({
      where: {
        username: currentUser.username
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            image: true,
            description: true
          }
        }
      }
    });
    
    return NextResponse.json({ success: true, wishlist });
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch wishlist' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { productId } = await request.json();
    const currentUser = await getCurrentUser();
    
    if (!currentUser.username) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    
    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId }
    });
    
    if (!product) {
      return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
    }
    
    // Check if item is already in wishlist
    const existing = await prisma.wishlistItem.findFirst({
      where: {
        username: currentUser.username,
        productId
      }
    });
    
    if (existing) {
      return NextResponse.json({ success: true, message: 'Already in wishlist' });
    }
    
    // Add to wishlist
    const wishlistItem = await prisma.wishlistItem.create({
      data: {
        username: currentUser.username,
        productId
      }
    });
    
    return NextResponse.json({ success: true, data: wishlistItem });
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    return NextResponse.json({ success: false, message: 'Failed to add to wishlist' }, { status: 500 });
  }
}