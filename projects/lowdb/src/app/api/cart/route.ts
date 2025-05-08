import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/actions/auth';

export async function GET() {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
    }
    
    // Initialize cart array if it doesn't exist
    if (!global.db.data.cart) {
      global.db.data.cart = [];
      await global.db.write();
      return NextResponse.json({ success: true, items: [] });
    }
    
    // Get all cart items for current user
    const cartItems = global.db.data.cart.filter(
      item => item.username === currentUser.username
    );
    
    // Get full product details for each cart item
    const cartProducts = [];
    
    for (const item of cartItems) {
      const product = global.db.data.products.find(p => p.id === item.productId);
      if (product) {
        cartProducts.push({
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: item.quantity
        });
      }
    }
    
    return NextResponse.json({ success: true, items: cartProducts });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch cart' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
    }
    
    const { productId, quantity } = await request.json();
    
    // Check if product exists
    const product = global.db.data.products.find(p => p.id === productId);
    if (!product) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }
    
    // Initialize cart array if it doesn't exist
    if (!global.db.data.cart) {
      global.db.data.cart = [];
    }
    
    // Check if item already in cart
    const existingCartItemIndex = global.db.data.cart.findIndex(
      item => item.username === currentUser.username && item.productId === productId
    );
    
    if (existingCartItemIndex > -1) {
      // Update existing item
      global.db.data.cart[existingCartItemIndex].quantity += quantity;
    } else {
      // Add new item
      global.db.data.cart.push({
        username: currentUser.username,
        productId,
        quantity
      });
    }
    
    await global.db.write();
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to add to cart' }, { status: 500 });
  }
}