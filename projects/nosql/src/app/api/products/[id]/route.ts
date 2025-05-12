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
import Product from '@/model/product'

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const product = await Product.findById((await params).id)
  return NextResponse.json({ success: true, data: product })
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const body = await request.json()
  const product = await Product.findByIdAndUpdate((await params).id, body, { new: true })
  return NextResponse.json({ success: true, data: product })
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const product = await Product.findByIdAndDelete((await params).id)
  return NextResponse.json({ success: true, data: product })
}
