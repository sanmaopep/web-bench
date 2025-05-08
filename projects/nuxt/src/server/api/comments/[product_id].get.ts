import { db } from '~/libs/db'

export default defineEventHandler(async (event) => {
  const productId = event.context.params?.product_id
  
  if (!productId) {
    throw createError({
      statusCode: 400,
      message: 'Product ID is required'
    })
  }
  
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT c.id, c.username, c.rating, c.comment, c.created_at
       FROM comments c
       WHERE c.product_id = ?
       ORDER BY c.created_at DESC`,
      [productId],
      (err, rows) => {
        if (err) {
          reject(createError({
            statusCode: 500,
            message: 'Failed to fetch comments'
          }))
          return
        }
        
        resolve({ comments: rows })
      }
    )
  })
})