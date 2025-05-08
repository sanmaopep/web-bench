import { NextResponse } from 'next/server';
import { Product } from '@/model';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const product = await Product.findByPk((await params).id);
    
    return NextResponse.json({ 
      success: true, 
      data: product 
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch product' 
    }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    const { name, price, image, description, quantity } = body;
    
    const product = await Product.findByPk((await params).id);
    
    if (!product) {
      return NextResponse.json({ 
        success: false, 
        error: 'Product not found' 
      }, { status: 404 });
    }
    
    await product.update({
      name,
      price,
      image,
      description,
      quantity
    });
    
    return NextResponse.json({ 
      success: true, 
      data: { id: (await params).id } 
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to update product' 
    }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const product = await Product.findByPk((await params).id);
    
    if (!product) {
      return NextResponse.json({ 
        success: false, 
        error: 'Product not found' 
      }, { status: 404 });
    }
    
    await product.destroy();
    
    return NextResponse.json({ 
      success: true, 
      data: { id: (await params).id } 
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to delete product' 
    }, { status: 500 });
  }
}