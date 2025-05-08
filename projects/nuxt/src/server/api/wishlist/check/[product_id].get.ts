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
      db.get(
        'SELECT * FROM wishlist WHERE username = ? AND product_id = ?',
        [payload.username, productId],
        (err, row) => {
          if (err) {
            reject(createError({
              statusCode: 500,
              message: 'Failed to check wishlist'
            }))
            return
          }
          
          resolve({ inWishlist: !!row })
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