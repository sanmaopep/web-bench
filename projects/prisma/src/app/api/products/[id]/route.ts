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