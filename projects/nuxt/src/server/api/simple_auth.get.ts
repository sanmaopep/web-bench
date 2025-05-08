import { jwtVerify } from 'jose'

export default defineEventHandler(async (event) => {
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
    
    return payload
  } catch (err) {
    throw createError({
      statusCode: 401,
      message: 'Invalid token'
    })
  }
})