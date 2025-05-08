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