import { db } from '~/libs/db'

export default defineEventHandler(async (event) => {
  const productId = event.context.params?.product_id
  
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM products WHERE id = ?', [productId], (err, row) => {
      if (err) {
        reject(createError({
          statusCode: 500,
          message: 'Failed to fetch product'
        }))
        return
      }
      
      if (!row) {
        reject(createError({
          statusCode: 404,
          message: 'Product not found'
        }))
        return
      }
      
      resolve({
        success: true,
        product: row
      })
    })
  })
}) 