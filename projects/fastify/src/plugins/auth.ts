// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//     http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { FastifyPluginAsync } from 'fastify';
import { SignJWT, jwtVerify } from 'jose';
import db from '../libs/db';

interface LoginPayload {
  username: string;
  password: string;
}

interface User {
  id?: number;
  username: string;
  role: string;
  coin?: number;
}

const JWT_SECRET = new TextEncoder().encode('WEBBENCH-SECRET');
const EXPIRATION = '1h';


export const getAuth = async (token?: string): Promise<Partial<Pick<User, 'username' | 'role'>>> => { 
  if(!token) {
    return {}
  }
  const { payload } = await jwtVerify(token, JWT_SECRET)
  return payload as Pick<User, 'username' | 'role'>
}

const auth: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.post('/api/auth', {
    schema: {
      body: {
        type: 'object',
        required: ['username', 'password'],
        properties: {
          username: { type: 'string' },
          password: { type: 'string' }
        }
      }
    }
  }, async (request, reply) => {
    const { username, password } = request.body as LoginPayload;
    
    return new Promise<{ success: boolean }>((resolve, reject) => {
      const sql = 'SELECT * FROM users WHERE username = ? AND password = ?';
      db.get(sql, [username, password], async (err, row) => {
        if (err) {
          fastify.log.error(err);
          return reject(err);
        }
        
        if (!row) {
          reply.status(401);
          return resolve({ success: false });
        }
        
        const user = row as User;
        
        const token = await new SignJWT({ 
          username: user.username, 
          role: user.role 
        })
          .setProtectedHeader({ alg: 'HS256' })
          .setIssuedAt()
          .setExpirationTime(EXPIRATION)
          .sign(JWT_SECRET);
        
        reply.setCookie('TOKEN', token, {
          path: '/',
          httpOnly: true,
          sameSite: 'strict'
        });
        
        resolve({ success: true });
      });
    });
  });

  fastify.get('/api/simple_auth', async (request, reply) => {
    const token = request.cookies.TOKEN;
    if (!token) {
      return reply.status(401).send({ error: 'Unauthorized' });
    } 
    
    const payload = await getAuth(token)
    return payload
  })

  fastify.get('/api/auth', async (request, reply) => {
    const token = request.cookies.TOKEN;
    
    if (!token) {
      return reply.status(401).send({ error: 'Unauthorized' });
    }
    
    try {
      const payload = await getAuth(token)
      
      return new Promise<{ username: string, role: string, coin: number }>((resolve, reject) => {
        const sql = 'SELECT username, role, coin FROM users WHERE username = ?';
        db.get(sql, [payload.username], (err, row) => {
          if (err) {
            fastify.log.error(err);
            return reject(err);
          }
          
          if (!row) {
            return reply.status(401).send({ error: 'User not found' });
          }
          
          resolve(row as { username: string, role: string, coin: number });
        });
      });
    } catch (err) {
      fastify.log.error(err);
      return reply.status(401).send({ error: 'Invalid token' });
    }
  });

  // Add a logout endpoint to clear the httpOnly cookie
  fastify.post('/api/logout', async (request, reply) => {
    reply.clearCookie('TOKEN', { path: '/' });
    return { success: true };
  });
};

export default auth;