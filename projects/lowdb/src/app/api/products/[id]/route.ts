import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const productId = params.id;
    const product = global.db.data.products.find(p => p.id === productId);
    return NextResponse.json({ success: true, data: product || null });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch product' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const productId = params.id;
    const { name, price, image, description, quantity } = await request.json();
    
    const productIndex = global.db.data.products.findIndex(p => p.id === productId);
    
    if (productIndex === -1) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }
    
    global.db.data.products[productIndex] = {
      ...global.db.data.products[productIndex],
      name,
      price,
      image,
      description,
      quantity
    };
    
    await global.db.write();
    
    return NextResponse.json({ success: true, data: { id: productId } });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const productId = params.id;
    
    const productIndex = global.db.data.products.findIndex(p => p.id === productId);
    
    if (productIndex === -1) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }
    
    global.db.data.products.splice(productIndex, 1);
    await global.db.write();
    
    return NextResponse.json({ success: true, data: { id: productId } });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete product' }, { status: 500 });
  }
}