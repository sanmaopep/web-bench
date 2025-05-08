import { prisma } from '@/libs/db';
import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/actions/auth';

export async function DELETE(
  request: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const productId = parseInt(params.productId);
    const currentUser = await getCurrentUser();
    
    if (!currentUser.username) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    
    // Delete from wishlist
    await prisma.wishlistItem.deleteMany({
      where: {
        username: currentUser.username,
        productId
      }
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    return NextResponse.json({ success: false, message: 'Failed to remove from wishlist' }, { status: 500 });
  }
}