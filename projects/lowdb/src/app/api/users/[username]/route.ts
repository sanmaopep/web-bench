import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { username: string } }
) {
  try {
    const { username } = params;
    const user = global.db.data.users.find(u => u.username === username);
    
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }
    
    return NextResponse.json({ 
      success: true, 
      user: {
        username: user.username,
        role: user.role,
        coin: user.coin
      }
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch user' }, { status: 500 });
  }
}