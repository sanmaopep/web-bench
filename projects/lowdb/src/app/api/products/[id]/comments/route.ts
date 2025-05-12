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

import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/actions/auth';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const productId = params.id;
    
    // Initialize comments array if it doesn't exist
    if (!global.db.data.comments) {
      global.db.data.comments = [];
      await global.db.write();
    }
    
    // Get all comments for this product
    const comments = global.db.data.comments.filter(c => c.productId === productId);
    
    return NextResponse.json({ success: true, comments });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch comments' }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
    }
    
    const productId = params.id;
    const { rating, text } = await request.json();
    
    // Initialize comments array if it doesn't exist
    if (!global.db.data.comments) {
      global.db.data.comments = [];
    }
    
    // Check if user has already commented on this product
    const existingComment = global.db.data.comments.find(
      c => c.username === currentUser.username && c.productId === productId
    );
    
    if (existingComment) {
      return NextResponse.json({ success: false, error: 'You have already commented on this product' }, { status: 400 });
    }
    
    // Check if user has purchased the product
    const hasPurchased = global.db.data.orders.some(order => 
      order.username === currentUser.username && 
      order.status === 'Finished' &&
      order.items.some(item => item.productId === productId)
    );
    
    if (!hasPurchased) {
      return NextResponse.json({ success: false, error: 'You must purchase this product before commenting' }, { status: 403 });
    }
    
    // Add new comment
    const newComment = {
      id: Date.now().toString(),
      username: currentUser.username,
      productId,
      rating,
      text,
      createdAt: new Date().toISOString()
    };
    
    global.db.data.comments.push(newComment);
    await global.db.write();
    
    return NextResponse.json({ success: true, comment: newComment });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create comment' }, { status: 500 });
  }
}