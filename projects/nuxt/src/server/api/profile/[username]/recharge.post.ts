import { db } from '~/libs/db'

export default defineEventHandler(async (event) => {
  const username = event.context.params?.username
  
  // Authenticate the user
  const cookie = getCookie(event, 'TOKEN')
  if (!cookie) {
    throw createError({
      statusCode: 401,
      message: 'Not authenticated'
    })
  }
  
  try {
    const secret = new TextEncoder().encode('WEBBENCH-SECRET')
    const { jwtVerify } = await import('jose')
    const { payload } = await jwtVerify(cookie, secret)
    
    // Make sure the user is recharging their own account
    if (payload.username !== username) {
      throw createError({
        statusCode: 403,
        message: 'Forbidden'
      })
    }
    
    return new Promise((resolve, reject) => {
      db.run(
        'UPDATE users SET coin = coin + 1000 WHERE username = ?',
        [username],
        function(err) {
          if (err) {
            reject(createError({
              statusCode: 500,
              message: 'Failed to recharge'
            }))
            return
          }
          
          if (this.changes === 0) {
            reject(createError({
              statusCode: 404,
              message: 'User not found'
            }))
            return
          }
          
          resolve({ success: true })
        }
      )
    })
  } catch (err) {
    throw createError({
      statusCode: 401,
      message: 'Invalid token'
    })
  }
})