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
import { Product } from '@/model';

export async function GET() {
  try {
    const products = await Product.findAll();
    
    return NextResponse.json({ 
      success: true, 
      products 
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch products' 
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, price, image, description, quantity } = body;
    
    const product = await Product.create({
      name,
      price,
      image,
      description,
      quantity
    });
    
    return NextResponse.json({ 
      success: true, 
      data: { id: product.id } 
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error
    }, { status: 500 });
  }
}