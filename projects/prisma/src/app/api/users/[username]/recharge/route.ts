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
import { prisma } from '@/libs/db';
import { getCurrentUser } from '@/actions/auth';

export async function POST(
  request: Request,
  { params }: { params: { username: string } }
) {
  const currentUser = await getCurrentUser();
  
  if (!currentUser || !currentUser.username) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }
  
  // Only allow users to recharge their own account
  if (currentUser.username !== params.username) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const updatedUser = await prisma.user.update({
      where: { username: params.username },
      data: {
        coin: {
          increment: 1000
        }
      },
      select: {
        username: true,
        coin: true
      }
    });
    
    return NextResponse.json({ 
      success: true, 
      data: updatedUser
    });
  } catch (error) {
    console.error('Recharge error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to recharge coins' 
    }, { status: 500 });
  }
}