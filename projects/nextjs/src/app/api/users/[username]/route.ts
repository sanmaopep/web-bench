import { NextRequest, NextResponse } from 'next/server'
import db from '@/libs/db'
import { getCurrentUser } from '@/actions/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params

  return new Promise((resolve) => {
    db.get(
      'SELECT username, role, coin, referral_code as referralCode FROM users WHERE username = ?',
      [username],
      (err, row) => {
        if (err) {
          resolve(NextResponse.json({ success: false, error: err.message }, { status: 500 }))
        } else if (row) {
          resolve(NextResponse.json({ success: true, user: row }))
        } else {
          resolve(NextResponse.json({ success: false, error: 'User not found' }, { status: 404 }))
        }
      }
    )
  })
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params
  const currentUser = await getCurrentUser()

  if (!currentUser || currentUser.username !== username) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  return new Promise((resolve) => {
    db.run('UPDATE users SET coin = coin + 1000 WHERE username = ?', [username], function (err) {
      if (err) {
        resolve(NextResponse.json({ success: false, error: err.message }, { status: 500 }))
      } else {
        db.get('SELECT coin FROM users WHERE username = ?', [username], (err, row) => {
          if (err) {
            resolve(NextResponse.json({ success: false, error: err.message }, { status: 500 }))
          } else {
            resolve(NextResponse.json({ success: true, coin: row.coin }))
          }
        })
      }
    })
  })
}
