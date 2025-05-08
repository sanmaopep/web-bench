import { prisma } from '@/libs/db';
import { NextResponse } from 'next/server';

export async function GET() {
  const users = await prisma.user.findMany({
    select: {
      username: true,
    },
  });
  
  const usernames = users.map(user => user.username);
  
  return NextResponse.json(usernames);
}