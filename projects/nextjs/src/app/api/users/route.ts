import { NextRequest, NextResponse } from 'next/server'
import db from '@/libs/db'
import { getCurrentUser } from '@/actions/auth'

export async function GET(request: NextRequest) {
  const currentUser = await getCurrentUser()

  if (!currentUser || currentUser.role !== 'admin') {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  return new Promise((resolve) => {
    db.all('SELECT username, role, coin FROM users', (err, rows) => {
      if (err) {
        resolve(NextResponse.json({ success: false, error: err.message }, { status: 500 }))
      } else {
        resolve(NextResponse.json({ success: true, users: rows }))
      }
    })
  })
}
