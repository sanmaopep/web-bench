import { db } from '~/libs/db'
import { jwtVerify } from 'jose'

export default defineEventHandler(async (event) => {
  // Verify admin authentication
  const cookie = getCookie(event, 'TOKEN')
  
  if (!cookie) {
    throw createError({
      statusCode: 401,
      message: 'Not authenticated'
    })
  }
  
  try {
    const secret = new TextEncoder().encode('WEBBENCH-SECRET')
    const { payload } = await jwtVerify(cookie, secret)
    
    // Check if user is admin
    if (payload.role !== 'admin') {
      throw createError({
        statusCode: 403,
        message: 'Forbidden: Admin access required'
      })
    }
    
    return new Promise((resolve, reject) => {
      db.all('SELECT username, role, coin FROM users', (err, rows) => {
        if (err) {
          reject(createError({
            statusCode: 500,
            message: 'Failed to fetch users'
          }))
          return
        }
        
        resolve({ success: true, users: rows })
      })
    })
  } catch (err) {
    throw createError({
      statusCode: 401,
      message: 'Invalid token or insufficient permissions'
    })
  }
})