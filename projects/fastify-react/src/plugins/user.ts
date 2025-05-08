import { FastifyPluginAsync } from 'fastify';
import fastifyPlugin from 'fastify-plugin';
import { db } from '../libs/db';
import * as jose from 'jose';

const SECRET = new TextEncoder().encode('WEBBENCH-SECRET');

interface User {
  username: string;
  role: string;
  coin: number;
}

const userPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.get<{ Params: { username: string } }>('/api/users/:username', async (request, reply) => {
    const { username } = request.params;
    const token = request.cookies.TOKEN;
    
    if (!token) {
      reply.status(401);
      return { success: false, message: 'Not authenticated' };
    }
    
    try {
      const { payload } = await jose.jwtVerify(token, SECRET);
      const tokenUsername = payload.username as string;
      const tokenRole = payload.role as string;
      
      // Check if user has permission to view this profile
      if (tokenRole !== 'admin' && tokenUsername !== username) {
        reply.status(403);
        return { success: false, message: 'Unauthorized' };
      }
      
      return new Promise<{ success: boolean; user?: User; message?: string }>((resolve, reject) => {
        db.get('SELECT username, role, coin FROM users WHERE username = ?', [username], (err, row) => {
          if (err) {
            reject(err);
            return;
          }
          
          if (!row) {
            reply.status(404);
            resolve({ success: false, message: 'User not found' });
            return;
          }
          
          resolve({
            success: true,
            user: row as User
          });
        });
      });
    } catch (error) {
      reply.status(401);
      return { success: false, message: 'Invalid token' };
    }
  });

  fastify.post<{ Params: { username: string } }>('/api/users/:username/recharge', async (request, reply) => {
    const { username } = request.params;
    const token = request.cookies.TOKEN;
    
    if (!token) {
      reply.status(401);
      return { success: false, message: 'Not authenticated' };
    }
    
    try {
      const { payload } = await jose.jwtVerify(token, SECRET);
      const tokenUsername = payload.username as string;
      
      // Only allow users to recharge their own account
      if (tokenUsername !== username) {
        reply.status(403);
        return { success: false, message: 'Unauthorized' };
      }
      
      return new Promise<{ success: boolean; message?: string }>((resolve, reject) => {
        db.run(
          'UPDATE users SET coin = coin + 1000 WHERE username = ?',
          [username],
          function (err) {
            if (err) {
              reject(err);
              return;
            }
            
            if (this.changes === 0) {
              reply.status(404);
              resolve({ success: false, message: 'User not found' });
              return;
            }
            
            resolve({
              success: true
            });
          }
        );
      });
    } catch (error) {
      reply.status(401);
      return { success: false, message: 'Invalid token' };
    }
  });
};

export default fastifyPlugin(userPlugin);