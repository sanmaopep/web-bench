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

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);
  
  if (isNaN(id)) {
    return NextResponse.json({ success: true, data: null });
  }

  const product = await prisma.product.findUnique({
    where: { id }
  });
  
  return NextResponse.json({ success: true, data: product });
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);
  const body = await request.json();
  const { name, price, image, description, quantity } = body;
  
  const product = await prisma.product.update({
    where: { id },
    data: {
      name,
      price,
      image,
      description,
      quantity
    }
  });
  
  return NextResponse.json({ success: true, data: { id: product.id } });
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);
  
  const product = await prisma.product.delete({
    where: { id }
  });
  
  return NextResponse.json({ success: true, data: { id: product.id } });
}