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

export async function POST(request: Request) {
  const { name, price, image, description, quantity } = await request.json()
  const product = await Product.create({ name, price, image, description, quantity })
  return NextResponse.json({ success: true, data: { id: product._id } })
}

export async function GET() {
  const products = await Product.find()
  return NextResponse.json({ success: true, products: products.map(product => ({
    id: product._id,
    name: product.name,
    price: product.price,
    image: product.image,
    description: product.description,
    quantity: product.quantity
  })) })
}