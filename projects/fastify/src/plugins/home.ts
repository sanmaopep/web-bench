import { FastifyPluginAsync } from 'fastify'
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode('WEBBENCH-SECRET');

const home: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get('/', async (request, reply) => {
    const token = request.cookies.TOKEN;
    let username = null;
    let userRole = null;
    
    if (token) {
      try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        username = payload.username;
        userRole = payload.role;
      } catch (err) {
        fastify.log.error(err);
      }
    }
    
    return reply.view('home.ejs', { 
      title: 'Shopping Mart',
      username,
      userRole
    })
  })

  fastify.get('/login', async (request, reply) => {
    return reply.view('login.ejs', { title: 'Login' })
  })
}

export default home