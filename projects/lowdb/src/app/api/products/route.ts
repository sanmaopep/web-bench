import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
  try {
    const products = global.db.data.products;
    return NextResponse.json({ success: true, products });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name, price, image, description, quantity } = await request.json();
    
    const newProduct = {
      id: uuidv4(),
      name,
      price,
      image,
      description,
      quantity
    };
    
    global.db.data.products.push(newProduct);
    await global.db.write();
    
    return NextResponse.json({ success: true, data: { id: newProduct.id } });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create product' }, { status: 500 });
  }
}