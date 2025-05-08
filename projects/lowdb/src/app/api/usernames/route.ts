import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const usernames = global.db.data.users.map(user => user.username);
    return NextResponse.json(usernames);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch usernames' }, { status: 500 });
  }
}