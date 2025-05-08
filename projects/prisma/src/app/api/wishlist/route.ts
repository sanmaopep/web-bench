import { prisma } from '@/libs/db';
import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/actions/auth';

export async function GET() {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser.username) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    
    const wishlist = await prisma.wishlistItem.findMany({
      where: {
        username: currentUser.username
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            image: true,
            description: true
          }
        }
      }
    });
    
    return NextResponse.json({ success: true, wishlist });
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch wishlist' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { productId } = await request.json();
    const currentUser = await getCurrentUser();
    
    if (!currentUser.username) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    
    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId }
    });
    
    if (!product) {
      return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
    }
    
    // Check if item is already in wishlist
    const existing = await prisma.wishlistItem.findFirst({
      where: {
        username: currentUser.username,
        productId
      }
    });
    
    if (existing) {
      return NextResponse.json({ success: true, message: 'Already in wishlist' });
    }
    
    // Add to wishlist
    const wishlistItem = await prisma.wishlistItem.create({
      data: {
        username: currentUser.username,
        productId
      }
    });
    
    return NextResponse.json({ success: true, data: wishlistItem });
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    return NextResponse.json({ success: false, message: 'Failed to add to wishlist' }, { status: 500 });
  }
}