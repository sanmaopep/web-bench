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

import { NextResponse, type NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const secret = new TextEncoder().encode('WEBBENCH-SECRET')

const verifyToken = async (token: string) => {
  try {
    const { payload } = await jwtVerify(token, secret)
    return payload as { username?: string; role?: string }
  } catch (error) {
    console.error('Token verification failed:', error)
    return {}
  }
}

export default async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const token = request.cookies.get('TOKEN')?.value
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    
    const decoded = await verifyToken(token)

    if (decoded.role !== 'admin') {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }
}

export const config = {
  matcher: ['/admin/:path*'],
}