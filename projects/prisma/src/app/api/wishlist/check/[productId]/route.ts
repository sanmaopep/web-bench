import { prisma } from '@/libs/db';
import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/actions/auth';

export async function GET(
  request: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const productId = parseInt(params.productId);
    const currentUser = await getCurrentUser();
    
    if (!currentUser.username) {
      return NextResponse.json({ isInWishlist: false });
    }
    
    // Check if item is in wishlist
    const item = await prisma.wishlistItem.findFirst({
      where: {
        username: currentUser.username,
        productId
      }
    });
    
    return NextResponse.json({ isInWishlist: !!item });
  } catch (error) {
    console.error('Error checking wishlist:', error);
    return NextResponse.json({ isInWishlist: false });
  }
}