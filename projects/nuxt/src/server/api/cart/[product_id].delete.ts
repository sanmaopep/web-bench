import { db } from '~/libs/db'
import { jwtVerify } from 'jose'

export default defineEventHandler(async (event) => {
  const cookie = getCookie(event, 'TOKEN')
  const productId = event.context.params?.product_id
  
  if (!cookie) {
    throw createError({
      statusCode: 401,
      message: 'Not authenticated'
    })
  }
  
  try {
    const secret = new TextEncoder().encode('WEBBENCH-SECRET')
    const { payload } = await jwtVerify(cookie, secret)
    
    return new Promise((resolve, reject) => {
      db.run(
        'DELETE FROM cart WHERE username = ? AND product_id = ?',
        [payload.username, productId],
        function(err) {
          if (err) {
            reject(createError({
              statusCode: 500,
              message: 'Failed to remove from cart'
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