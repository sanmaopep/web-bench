import { prisma } from '@/libs/db';
import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/actions/auth';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const cartItemId = parseInt(params.id);
    const currentUser = await getCurrentUser();
    
    if (!currentUser.username) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    
    // First verify that this cart item belongs to the current user
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: cartItemId },
      select: { username: true }
    });
    
    if (!cartItem || cartItem.username !== currentUser.username) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    
    // Delete the cart item
    await prisma.cartItem.delete({
      where: { id: cartItemId }
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing item from cart:', error);
    return NextResponse.json({ success: false, message: 'Failed to remove item from cart' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const cartItemId = parseInt(params.id);
    const { quantity } = await request.json();
    const currentUser = await getCurrentUser();
    
    if (!currentUser.username) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    
    // First verify that this cart item belongs to the current user
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: cartItemId },
      select: { username: true }
    });
    
    if (!cartItem || cartItem.username !== currentUser.username) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    
    // Update the cart item quantity
    const updatedCartItem = await prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity }
    });
    
    return NextResponse.json({ success: true, data: updatedCartItem });
  } catch (error) {
    console.error('Error updating cart item:', error);
    return NextResponse.json({ success: false, message: 'Failed to update cart item' }, { status: 500 });
  }
}