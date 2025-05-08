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
    
    // Check if the user is an admin
    if (currentUser.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }
    
    // Find the order
    const orderIndex = global.db.data.orders.findIndex(o => o.id === params.orderId);
    
    if (orderIndex === -1) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }
    
    const order = global.db.data.orders[orderIndex];
    
    // Check if the order is in refund reviewing status
    if (order.status !== 'Refund Reviewing') {
      return NextResponse.json({ success: false, error: 'Order is not in refund reviewing status' }, { status: 400 });
    }
    
    // Find the user to refund
    const userIndex = global.db.data.users.findIndex(u => u.username === order.username);
    
    if (userIndex === -1) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }
    
    // Update user's coin balance
    global.db.data.users[userIndex].coin += order.totalPrice;
    
    // Update order status
    global.db.data.orders[orderIndex].status = 'Refund Passed';
    
    await global.db.write();
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Approve refund error:', error);
    return NextResponse.json({ success: false, error: 'Failed to process refund approval' }, { status: 500 });
  }
}