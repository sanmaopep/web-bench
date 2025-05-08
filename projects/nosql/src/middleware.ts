import { NextResponse, type NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const secret = new TextEncoder().encode('WEBBENCH-SECRET')

const verifyToken = async (token: string) => {
  try {
    const { payload } = await jwtVerify(token, secret)
    return payload as { username?: string; role?: string }
  } catch (error) {
    console.error('Token verification failed:', error)
    return {}
  }
}

export default async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const token = request.cookies.get('TOKEN')?.value
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    const decoded = await verifyToken(token)

    if (decoded.role !== 'admin') {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }
}

export const config = {
  matcher: ['/admin/:path*'],
}
