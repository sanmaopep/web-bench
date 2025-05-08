import { prisma } from '@/libs/db';
import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/actions/auth';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = parseInt(params.id);
    const currentUser = await getCurrentUser();
    
    if (!currentUser.username || currentUser.role !== 'admin') {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    
    // Get the order
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { orderItems: true }
    });
    
    if (!order) {
      return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
    }
    
    if (order.status !== 'Refund Reviewing') {
      return NextResponse.json(
        { success: false, message: 'Order is not in refund reviewing status' }, 
        { status: 400 }
      );
    }
    
    // Process refund in a transaction
    const result = await prisma.$transaction(async (prisma) => {
      // Update order status
      const updatedOrder = await prisma.order.update({
        where: { id: orderId },
        data: { status: 'Refund Passed' }
      });
      
      // Refund coins to user
      await prisma.user.update({
        where: { username: order.username },
        data: {
          coin: {
            increment: order.totalPrice
          }
        }
      });
      
      return updatedOrder;
    });
    
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Error approving refund:', error);
    return NextResponse.json({ success: false, message: 'Failed to approve refund' }, { status: 500 });
  }
}