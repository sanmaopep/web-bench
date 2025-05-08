import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    (await cookies()).set({
      name: 'TOKEN',
      value: '',
      expires: new Date(0),
      path: '/',
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to logout' 
    }, { status: 500 });
  }
}