import { FastifyPluginAsync } from 'fastify';
import fastifyPlugin from 'fastify-plugin';
import { db } from '../libs/db';
import * as jose from 'jose';

interface User {
  id?: number;
  username: string;
  password?: string;
  role: string;
  coin: number;
}

interface LoginRequest {
  username: string;
  password: string;
}

const SECRET = new TextEncoder().encode('WEBBENCH-SECRET');

const authPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.post<{ Body: LoginRequest }>('/api/auth', async (request, reply) => {
    const { username, password } = request.body;
    
    return new Promise<{ success: boolean }>((resolve, reject) => {
      db.get(
        'SELECT * FROM users WHERE username = ? AND password = ?',
        [username, password],
        async (err, row) => {
          if (err) {
            reject(err);
            return;
          }
          
          if (!row) {
            reply.status(401);
            resolve({ success: false });
            return;
          }
          
          const user = row as User;
          
          // Generate JWT
          const token = await new jose.SignJWT({ 
            username: user.username, 
            role: user.role 
          })
            .setProtectedHeader({ alg: 'HS256' })
            .setExpirationTime('1h')
            .sign(SECRET);
          
          reply.setCookie('TOKEN', token, {
            path: '/',
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
          });
          
          resolve({ success: true });
        }
      );
    });
  });

  fastify.get('/api/auth', async (request, reply) => {
    const token = request.cookies.TOKEN;
    
    if (!token) {
      reply.status(401);
      return { success: false, message: 'Not authenticated' };
    }
    
    try {
      const { payload } = await jose.jwtVerify(token, SECRET);
      const { username } = payload;
      
      return new Promise<User>((resolve, reject) => {
        db.get('SELECT username, role, coin FROM users WHERE username = ?', [username], (err, row) => {
          if (err) {
            reject(err);
            return;
          }
          
          if (!row) {
            reply.status(401);
            reject(new Error('User not found'));
            return;
          }
          
          resolve(row as User);
        });
      });
    } catch (error) {
      reply.status(401);
      return { success: false, message: 'Invalid token' };
    }
  });
};

export default fastifyPlugin(authPlugin);