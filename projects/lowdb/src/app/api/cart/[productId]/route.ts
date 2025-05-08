import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/actions/auth';

export async function GET(
  request: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
    }
    
    // Initialize cart array if it doesn't exist
    if (!global.db.data.cart) {
      global.db.data.cart = [];
      await global.db.write();
      return NextResponse.json({ success: true, data: null });
    }
    
    const cartItem = global.db.data.cart.find(
      item => item.username === currentUser.username && item.productId === params.productId
    );
    
    return NextResponse.json({ success: true, data: cartItem || null });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch cart item' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
    }
    
    const { quantity } = await request.json();
    
    // Initialize cart array if it doesn't exist
    if (!global.db.data.cart) {
      global.db.data.cart = [];
    }
    
    const cartItemIndex = global.db.data.cart.findIndex(
      item => item.username === currentUser.username && item.productId === params.productId
    );
    
    if (cartItemIndex === -1) {
      return NextResponse.json({ success: false, error: 'Cart item not found' }, { status: 404 });
    }
    
    // Update the quantity
    global.db.data.cart[cartItemIndex].quantity = quantity;
    await global.db.write();
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update cart item' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
    }
    
    // Initialize cart array if it doesn't exist
    if (!global.db.data.cart) {
      global.db.data.cart = [];
      await global.db.write();
      return NextResponse.json({ success: true });
    }
    
    // Remove the item from cart
    const initialLength = global.db.data.cart.length;
    global.db.data.cart = global.db.data.cart.filter(
      item => !(item.username === currentUser.username && item.productId === params.productId)
    );
    
    if (global.db.data.cart.length === initialLength) {
      return NextResponse.json({ success: false, error: 'Cart item not found' }, { status: 404 });
    }
    
    await global.db.write();
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to remove cart item' }, { status: 500 });
  }
}