import { prisma } from '@/libs/db';
import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/actions/auth';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const productId = parseInt(params.id);
    
    const comments = await prisma.productComment.findMany({
      where: {
        productId
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return NextResponse.json({ success: true, comments });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const productId = parseInt(params.id);
    const { rating, comment } = await request.json();
    const currentUser = await getCurrentUser();
    
    if (!currentUser.username) {
      return NextResponse.json(
        { success: false, message: 'User not authenticated' },
        { status: 401 }
      );
    }
    
    // Validate input
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, message: 'Invalid rating. Must be between 1 and 5.' },
        { status: 400 }
      );
    }
    
    if (!comment || comment.trim() === '') {
      return NextResponse.json(
        { success: false, message: 'Comment text is required' },
        { status: 400 }
      );
    }
    
    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId }
    });
    
    if (!product) {
      return NextResponse.json(
        { success: false, message: 'Product not found' },
        { status: 404 }
      );
    }
    
    // Check if user has already commented on this product
    const existingComment = await prisma.productComment.findFirst({
      where: {
        username: currentUser.username,
        productId
      }
    });
    
    if (existingComment) {
      return NextResponse.json(
        { success: false, message: 'You have already reviewed this product' },
        { status: 400 }
      );
    }
    
    // Check if user has purchased this product
    const completedOrders = await prisma.order.findMany({
      where: {
        username: currentUser.username,
        status: 'Finished'
      },
      include: {
        orderItems: {
          where: {
            productId
          }
        }
      }
    });
    
    // Filter orders that contain this product
    const ordersWithProduct = completedOrders.filter(order => order.orderItems.length > 0);
    
    if (ordersWithProduct.length === 0) {
      return NextResponse.json(
        { success: false, message: 'You can only review products you have purchased' },
        { status: 403 }
      );
    }
    
    // Create the comment
    const newComment = await prisma.productComment.create({
      data: {
        username: currentUser.username,
        productId,
        rating,
        comment,
      }
    });
    
    return NextResponse.json({ success: true, data: newComment });
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to submit comment' },
      { status: 500 }
    );
  }
}