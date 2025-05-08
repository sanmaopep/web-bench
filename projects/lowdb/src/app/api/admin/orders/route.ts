import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/actions/auth';

export async function GET() {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
    }
    
    // Check if the user is an admin
    if (currentUser.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }
    
    // Initialize orders array if it doesn't exist
    if (!global.db.data.orders) {
      global.db.data.orders = [];
      await global.db.write();
    }
    
    // Sort orders by creation date (newest first)
    const sortedOrders = [...global.db.data.orders].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    return NextResponse.json({ success: true, orders: sortedOrders });
  } catch (error) {
    console.error('Get admin orders error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch orders' }, { status: 500 });
  }
}