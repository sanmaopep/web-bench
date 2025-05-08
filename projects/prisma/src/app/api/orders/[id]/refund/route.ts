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
    
    if (!currentUser.username) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    
    // Check if order exists and belongs to the current user
    const order = await prisma.order.findUnique({
      where: { id: orderId }
    });
    
    if (!order) {
      return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
    }
    
    if (order.username !== currentUser.username) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    
    if (order.status !== 'Finished') {
      return NextResponse.json(
        { success: false, message: 'Only finished orders can be refunded' }, 
        { status: 400 }
      );
    }
    
    // Update order status to refund reviewing
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status: 'Refund Reviewing' }
    });
    
    return NextResponse.json({ success: true, data: updatedOrder });
  } catch (error) {
    console.error('Error requesting refund:', error);
    return NextResponse.json({ success: false, message: 'Failed to request refund' }, { status: 500 });
  }
}