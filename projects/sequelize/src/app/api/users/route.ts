import { NextResponse } from 'next/server';
import { User } from '@/model';
import { getLoggedInUser } from '@/actions/auth';

export async function GET() {
  try {
    const currentUser = await getLoggedInUser();
    
    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json({ 
        success: false, 
        error: 'Unauthorized' 
      }, { status: 401 });
    }
    
    const users = await User.findAll({
      attributes: ['username', 'role', 'coin', 'createdAt', 'updatedAt']
    });
    
    return NextResponse.json({ 
      success: true, 
      users 
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch users' 
    }, { status: 500 });
  }
}