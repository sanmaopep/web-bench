import { prisma } from '@/libs/db';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();
  const { name, price, image, description, quantity } = body;
  
  const product = await prisma.product.create({
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

export async function GET() {
  const products = await prisma.product.findMany();
  
  return NextResponse.json({ success: true, products });
}