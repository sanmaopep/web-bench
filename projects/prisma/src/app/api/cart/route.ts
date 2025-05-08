import { prisma } from '@/libs/db';
import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/actions/auth';

export async function GET() {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser.username) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    
    const cart = await prisma.cartItem.findMany({
      where: {
        username: currentUser.username
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            image: true
          }
        }
      }
    });
    
    return NextResponse.json({ success: true, cart });
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch cart' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { productId, quantity } = await request.json();
    const currentUser = await getCurrentUser();
    
    if (!currentUser.username) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    
    // Check if product exists and has enough quantity
    const product = await prisma.product.findUnique({
      where: { id: productId }
    });
    
    if (!product) {
      return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
    }
    
    if (product.quantity < quantity) {
      return NextResponse.json({ success: false, message: 'Not enough product in stock' }, { status: 400 });
    }
    
    // Check if item is already in cart
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        username: currentUser.username,
        productId
      }
    });
    
    let cartItem;
    
    if (existingItem) {
      // Update quantity of existing item
      cartItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: existingItem.quantity + quantity
        }
      });
    } else {
      // Add new item to cart
      cartItem = await prisma.cartItem.create({
        data: {
          username: currentUser.username,
          productId,
          quantity
        }
      });
    }
    
    return NextResponse.json({ success: true, data: cartItem });
  } catch (error) {
    console.error('Error adding to cart:', error);
    return NextResponse.json({ success: false, message: 'Failed to add to cart' }, { status: 500 });
  }
}