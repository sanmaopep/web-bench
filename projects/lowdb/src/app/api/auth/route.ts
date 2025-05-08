import { NextResponse } from 'next/server';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const SECRET = new TextEncoder().encode('WEBBENCH-SECRET');

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();
    
    const user = global.db.data.users.find(
      u => u.username === username && u.password === password
    );
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    const token = await new SignJWT({
      username: user.username,
      role: user.role
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('1h')
      .sign(SECRET);
    
    ;(await cookies()).set({
      name: 'TOKEN',
      value: token,
      httpOnly: true,
      path: '/',
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Authentication failed' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const token = (await cookies()).get('TOKEN')?.value;
    
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    try {
      // Verify the token and get the payload
      const { payload } = await jwtVerify(token, SECRET);
      
      const user = global.db.data.users.find(u => u.username === payload.username);
      
      if (!user) {
        return NextResponse.json(
          { success: false, error: 'User not found' },
          { status: 401 }
        );
      }
      
      return NextResponse.json({
        username: user.username,
        role: user.role,
        coin: user.coin
      });
    } catch (verifyError) {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Authentication failed' },
      { status: 401 }
    );
  }
}