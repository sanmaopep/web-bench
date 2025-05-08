import { NextResponse } from 'next/server';
import { User } from '@/model';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;
    
    const user = await User.findOne({ where: { username } });
    
    if (!user || user.password !== password) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid credentials' 
      }, { status: 401 });
    }
    
    const secret = new TextEncoder().encode('WEBBENCH-SECRET');
    const token = await new SignJWT({ 
      username: user.username, 
      role: user.role 
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('1h')
      .sign(secret);
    
    (await cookies()).set({
      name: 'TOKEN',
      value: token,
      httpOnly: true,
      path: '/',
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to login' 
    }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const tokenCookie = (await cookies()).get('TOKEN');
    
    if (!tokenCookie) {
      return NextResponse.json({ 
        success: false, 
        error: 'Not authenticated' 
      }, { status: 401 });
    }
    
    // Properly verify the token
    const secret = new TextEncoder().encode('WEBBENCH-SECRET');
    try {
      const { payload } = await jwtVerify(tokenCookie.value, secret);
      const username = payload.username as string;
      
      const user = await User.findOne({ where: { username } });
      
      if (!user) {
        return NextResponse.json({ 
          success: false, 
          error: 'User not found' 
        }, { status: 401 });
      }
      
      return NextResponse.json({
        username: user.username,
        role: user.role,
        coin: user.coin
      });
    } catch (error) {
      // Token verification failed
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid token' 
      }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to get user information' 
    }, { status: 500 });
  }
}