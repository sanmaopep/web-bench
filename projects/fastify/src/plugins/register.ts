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
import { SignJWT } from 'jose';
import db from '../libs/db';

const JWT_SECRET = new TextEncoder().encode('WEBBENCH-SECRET');
const EXPIRATION = '1h';

interface RegisterPayload {
  username: string;
  password: string;
  referralCode?: string;
}

const register: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get('/register', async (request, reply) => {
    return reply.view('register.ejs', { title: 'Register' });
  });

  fastify.post('/api/register', {
    schema: {
      body: {
        type: 'object',
        required: ['username', 'password'],
        properties: {
          username: { type: 'string', minLength: 3 },
          password: { type: 'string', minLength: 6 },
          referralCode: { type: 'string' }
        }
      }
    }
  }, async (request, reply) => {
    const { username, password, referralCode } = request.body as RegisterPayload;
    
    return new Promise<{ success: boolean, message?: string }>((resolve, reject) => {
      // Check if username already exists
      db.get('SELECT id FROM users WHERE username = ?', [username], async (err, row) => {
        if (err) {
          fastify.log.error(err);
          return reject(err);
        }
        
        if (row) {
          reply.status(400);
          return resolve({ success: false, message: 'Username already exists' });
        }
        
        try {
          let referrerId = null;
          
          // Check if referral code exists and get the referrer
          if (referralCode) {
            const referrer = await new Promise<any>((resolve, reject) => {
              db.get('SELECT id FROM users WHERE referral_code = ?', [referralCode], (err, row) => {
                if (err) reject(err);
                else resolve(row);
              });
            });
            
            if (referrer) {
              referrerId = referrer.id;
            }
          }
          
          // Generate a unique referral code for the new user
          const newReferralCode = `${username}-${Math.random().toString(36).substring(2, 8)}`;
          
          await new Promise((resolve, reject) => {
            db.run('INSERT INTO users (username, password, role, coin, referrer_id, referral_code) VALUES (?, ?, ?, ?, ?, ?)', [username, password, 'user', 1000, referrerId, newReferralCode], (err, row) => {
              if (err) reject(err);
              else resolve(row);
            });
          });

          
          // If there's a valid referrer and we have a new user ID, add the referral reward
          if (referrerId) {
            await new Promise((resolve, reject) => {
              db.run('UPDATE users SET coin = coin + 888 WHERE id = ?', [referrerId], (err) => {
                if (err) reject(err);
                else resolve(true);
              });
            });
          }
          
          // Create and set JWT token
          const token = await new SignJWT({ 
            username: username, 
            role: 'user' 
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
        } catch (err) {
          fastify.log.error(err);
          return reject(err);
        }
      });
    });
  });
};

export default register;