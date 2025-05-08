import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/actions/auth';

export async function POST(
  request: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
    }
    
    // Find the order
    const orderIndex = global.db.data.orders.findIndex(o => o.id === params.orderId);
    
    if (orderIndex === -1) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }
    
    const order = global.db.data.orders[orderIndex];
    
    // Check if the order belongs to the current user
    if (order.username !== currentUser.username) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }
    
    // Check if the order is in finished status
    if (order.status !== 'Finished') {
      return NextResponse.json({ success: false, error: 'Order is not in finished status' }, { status: 400 });
    }
    
    // Update order status to refund reviewing
    global.db.data.orders[orderIndex].status = 'Refund Reviewing';
    await global.db.write();
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Refund request error:', error);
    return NextResponse.json({ success: false, error: 'Failed to process refund request' }, { status: 500 });
  }
}