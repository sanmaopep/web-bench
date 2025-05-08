import { db } from '~/libs/db'

export default defineEventHandler(async (event) => {
  const username = event.context.params?.username
  
  if (!username) {
    throw createError({
      statusCode: 400,
      message: 'Username is required'
    })
  }

  return new Promise((resolve, reject) => {
    db.get('SELECT username, coin FROM users WHERE username = ?', [username], (err, row) => {
      if (err) {
        reject(err)
      } else if (!row) {
        reject(createError({
          statusCode: 404,
          message: 'User not found'
        }))
      } else {
        resolve(row)
      }
    })
  })
}) 