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
