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