import { NextResponse } from 'next/server';
import { User } from '@/model';

export async function GET() {
  try {
    const users = await User.findAll({
      attributes: ['username']
    });
    
    const usernames = users.map(user => user.username);
    
    return NextResponse.json(usernames);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch usernames' }, { status: 500 });
  }
}