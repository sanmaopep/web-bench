import { prisma } from '@/libs/db';
import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/actions/auth';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const currentUser = await getCurrentUser();
    
    if (!currentUser.username) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        orderItems: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                image: true
              }
            }
          }
        }
      }
    });
    
    // Check if order belongs to current user or user is admin
    if (!order || (order.username !== currentUser.username && currentUser.role !== 'admin')) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    
    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch order' }, { status: 500 });
  }
}