import { NextResponse } from 'next/server';
import { prisma } from '@/libs/db';
import { getCurrentUser } from '@/actions/auth';

export async function POST(
  request: Request,
  { params }: { params: { username: string } }
) {
  const currentUser = await getCurrentUser();
  
  if (!currentUser || !currentUser.username) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }
  
  // Only allow users to recharge their own account
  if (currentUser.username !== params.username) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const updatedUser = await prisma.user.update({
      where: { username: params.username },
      data: {
        coin: {
          increment: 1000
        }
      },
      select: {
        username: true,
        coin: true
      }
    });
    
    return NextResponse.json({ 
      success: true, 
      data: updatedUser
    });
  } catch (error) {
    console.error('Recharge error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to recharge coins' 
    }, { status: 500 });
  }
}