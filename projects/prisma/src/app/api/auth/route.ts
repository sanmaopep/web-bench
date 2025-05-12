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
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { getCurrentUser } from '@/actions/auth';

export async function POST(request: Request) {
  const body = await request.json();
  const { username, password } = body;

  const user = await prisma.user.findUnique({
    where: { username }
  });

  if (!user || user.password !== password) {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  const token = await new SignJWT({ 
    username: user.username, 
    role: user.role 
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1h')
    .sign(new TextEncoder().encode('WEBBENCH-SECRET'));

  const cookieStore = await cookies()
  cookieStore.set({
    name: 'TOKEN',
    value: token,
    httpOnly: true,
    path: '/',
  });

  return NextResponse.json({ success: true });
}

export async function GET() {
  try {
    const { username } = await getCurrentUser()

    if (!username) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        username: true,
        role: true,
        coin: true
      }
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 401 });
    }

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
}