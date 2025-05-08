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
    
    // Get the order and verify it belongs to the current user
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        orderItems: {
          include: {
            product: true
          }
        }
      }
    });
    
    if (!order) {
      return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
    }
    
    if (order.username !== currentUser.username) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    
    if (order.status !== 'Pending payment') {
      return NextResponse.json({ success: false, message: 'Order is not pending payment' }, { status: 400 });
    }
    
    // Get user's coins
    const user = await prisma.user.findUnique({
      where: { username: currentUser.username },
      select: { 
        username: true,
        coin: true,
        isFirstPurchase: true,
        referredBy: true
      }
    });
    
    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }
    
    // Check if user has enough coins
    if (user.coin < order.totalPrice) {
      // Update order status to failed
      await prisma.order.update({
        where: { id: orderId },
        data: { status: 'Failed' }
      });
      
      return NextResponse.json({ success: false, message: 'Insufficient funds' }, { status: 400 });
    }
    
    // Check if products have enough quantity
    for (const item of order.orderItems) {
      if (item.product.quantity < item.quantity) {
        // Update order status to failed
        await prisma.order.update({
          where: { id: orderId },
          data: { status: 'Failed' }
        });
        
        return NextResponse.json({ success: false, message: 'Product out of stock' }, { status: 400 });
      }
    }
    
    // Process payment in a transaction
    const result = await prisma.$transaction(async (prisma) => {
      // Deduct coins from user
      await prisma.user.update({
        where: { username: currentUser.username },
        data: {
          coin: {
            decrement: order.totalPrice
          },
          isFirstPurchase: false
        }
      });
      
      // Update product quantities
      for (const item of order.orderItems) {
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            quantity: {
              decrement: item.quantity
            }
          }
        });
      }
      
      // If this is the user's first purchase and they were referred, award the referrer
      if (user.isFirstPurchase && user.referredBy) {
        await prisma.user.update({
          where: { username: user.referredBy },
          data: {
            coin: {
              increment: 1888
            }
          }
        });
      }
      
      // Update order status
      return prisma.order.update({
        where: { id: orderId },
        data: { status: 'Finished' }
      });
    });
    
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Error processing payment:', error);
    
    // If any error occurs, update order status to failed
    try {
      await prisma.order.update({
        where: { id: parseInt(params.id) },
        data: { status: 'Failed' }
      });
    } catch (updateError) {
      console.error('Error updating order status:', updateError);
    }
    
    return NextResponse.json({ success: false, message: 'Payment processing failed' }, { status: 500 });
  }
}