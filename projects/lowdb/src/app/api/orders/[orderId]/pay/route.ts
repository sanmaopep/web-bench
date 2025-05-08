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
    
    // Check if the order is in pending payment status
    if (order.status !== 'Pending payment') {
      return NextResponse.json({ success: false, error: 'Order is not in pending payment status' }, { status: 400 });
    }
    
    // Check if the user has enough coins
    const userIndex = global.db.data.users.findIndex(u => u.username === currentUser.username);
    
    if (global.db.data.users[userIndex].coin < order.totalPrice) {
      // Update order status to failed
      global.db.data.orders[orderIndex].status = 'Failed';
      await global.db.write();
      
      return NextResponse.json({ success: false, error: 'Insufficient funds' }, { status: 400 });
    }
    
    // Check if products are in stock and update inventory
    let hasStockIssue = false;
    
    for (const item of order.items) {
      const productIndex = global.db.data.products.findIndex(p => p.id === item.productId);
      
      if (productIndex === -1 || global.db.data.products[productIndex].quantity < item.quantity) {
        hasStockIssue = true;
        break;
      }
      
      // Decrease product quantity
      global.db.data.products[productIndex].quantity -= item.quantity;
    }
    
    if (hasStockIssue) {
      // Update order status to failed
      global.db.data.orders[orderIndex].status = 'Failed';
      await global.db.write();
      
      return NextResponse.json({ success: false, error: 'Some products are out of stock' }, { status: 400 });
    }
    
    // Process payment
    global.db.data.users[userIndex].coin -= order.totalPrice;
    global.db.data.orders[orderIndex].status = 'Finished';
    
    // Check if this user was referred and this is their first paid order
    if (!global.db.data.referrals) {
      global.db.data.referrals = [];
    }
    
    const referral = global.db.data.referrals.find(r => 
      r.newUserUsername === currentUser.username && !r.orderRewardPaid
    );
    
    if (referral) {
      // Find the referrer
      const referrerIndex = global.db.data.users.findIndex(u => u.username === referral.referrerUsername);
      
      if (referrerIndex >= 0) {
        // Add order completion reward
        global.db.data.users[referrerIndex].coin += 1888;
        
        // Mark the order reward as paid
        const referralIndex = global.db.data.referrals.findIndex(r => 
          r.newUserUsername === currentUser.username && !r.orderRewardPaid
        );
        
        if (referralIndex >= 0) {
          global.db.data.referrals[referralIndex].orderRewardPaid = true;
        }
      }
    }
    
    await global.db.write();
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Payment error:', error);
    return NextResponse.json({ success: false, error: 'Failed to process payment' }, { status: 500 });
  }
}