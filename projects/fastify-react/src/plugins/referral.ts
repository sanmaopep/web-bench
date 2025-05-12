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
import fastifyPlugin from 'fastify-plugin';
import { dbAll, dbGet, dbRun, runTransaction, TransactionSQL } from '../libs/db';
import * as jose from 'jose';
import crypto from 'crypto';

const SECRET = new TextEncoder().encode('WEBBENCH-SECRET');

interface ReferralHistory {
  username: string;
  reward: number;
  date: string;
  type: 'registration' | 'order';
}

const referralPlugin: FastifyPluginAsync = async (fastify) => {
  // Generate a unique referral code for a new user
  const generateReferralCode = async (username: string): Promise<string> => {
    // Create a base code using a combination of username and random string
    const hash = crypto.createHash('sha256').update(username + Date.now().toString()).digest('hex');
    const baseCode = hash.substring(0, 8).toUpperCase();
    
    // Check if code already exists and regenerate if needed
    const existingCode = await dbGet<{ referral_code: string }>(
      'SELECT referral_code FROM users WHERE referral_code = ?',
      [baseCode]
    );
    
    if (existingCode) {
      // Recursively try again with a different code
      return generateReferralCode(username + '1');
    }
    
    return baseCode;
  };

  // Process referral reward when a new user registers with a referral code
  const processRegistrationReferral = async (referrerUsername: string, newUsername: string) => {
    const REGISTRATION_REWARD = 888;
    
    const transactionSQLs: TransactionSQL[] = [
      // Add coins to referrer
      {
        sql: 'UPDATE users SET coin = coin + ? WHERE username = ?',
        deps: [REGISTRATION_REWARD, referrerUsername]
      },
      // Create referral record
      {
        sql: 'INSERT INTO referrals (referrer_username, referred_username, registration_rewarded, date) VALUES (?, ?, 1, ?)',
        deps: [referrerUsername, newUsername, new Date().toISOString()]
      },
      // Record the reward
      {
        sql: 'INSERT INTO referral_rewards (referrer_username, referred_username, reward_amount, reward_type, date) VALUES (?, ?, ?, ?, ?)',
        deps: [referrerUsername, newUsername, REGISTRATION_REWARD, 'registration', new Date().toISOString()]
      }
    ];
    
    await runTransaction(transactionSQLs);
  };

  // Process referral reward when a referred user pays for their first order
  fastify.addHook('onRequest', async (request, reply) => {
    if (request.url.match(/^\/api\/orders\/\d+\/pay$/i) && request.method === 'POST') {
      const token = request.cookies.TOKEN;
      
      if (!token) return;
      
      try {
        const { payload } = await jose.jwtVerify(token, SECRET);
        const username = payload.username as string;
        
        // Check if this user was referred and if first order reward is pending
        const referral = await dbGet<{ referrer_username: string; first_order_rewarded: number }>(
          'SELECT referrer_username, first_order_rewarded FROM referrals WHERE referred_username = ?',
          [username]
        );
        
        if (referral && !referral.first_order_rewarded) {
          // Save this for later, actual reward will be processed after the payment is confirmed
          request.referralInfo = {
            referrer: referral.referrer_username,
            referred: username
          };
        }
      } catch (error) {
        // Just ignore errors here, not critical
      }
    }
  });

  // After order is successfully paid, process the first order referral reward
  fastify.addHook('onResponse', async (request, reply) => {
    if (request.url.match(/^\/api\/orders\/\d+\/pay$/i) && 
        request.method === 'POST' && 
        reply.statusCode === 200 &&
        request.referralInfo) {
      
      try {
        const responseBody = JSON.parse(reply.getPayload() as string);
        
        if (responseBody.success) {
          const FIRST_ORDER_REWARD = 1888;
          const { referrer, referred } = request.referralInfo;
          
          const transactionSQLs: TransactionSQL[] = [
            // Add coins to referrer
            {
              sql: 'UPDATE users SET coin = coin + ? WHERE username = ?',
              deps: [FIRST_ORDER_REWARD, referrer]
            },
            // Update referral record
            {
              sql: 'UPDATE referrals SET first_order_rewarded = 1 WHERE referrer_username = ? AND referred_username = ?',
              deps: [referrer, referred]
            },
            // Record the reward
            {
              sql: 'INSERT INTO referral_rewards (referrer_username, referred_username, reward_amount, reward_type, date) VALUES (?, ?, ?, ?, ?)',
              deps: [referrer, referred, FIRST_ORDER_REWARD, 'order', new Date().toISOString()]
            }
          ];
          
          await runTransaction(transactionSQLs);
        }
      } catch (error) {
        console.error('Error processing referral reward:', error);
      }
    }
  });

  // Get referral code and history for a user
  fastify.get<{ Params: { username: string } }>('/api/users/:username/referral', async (request, reply) => {
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
      
      // Get referral code
      const user = await dbGet<{ referral_code: string }>(
        'SELECT referral_code FROM users WHERE username = ?',
        [username]
      );
      
      if (!user) {
        reply.status(404);
        return { success: false, message: 'User not found' };
      }
      
      // Get referral history
      const referralRewards = await dbAll<ReferralHistory[]>(
        `SELECT 
          referred_username as username, 
          reward_amount as reward, 
          date, 
          reward_type as type
        FROM referral_rewards 
        WHERE referrer_username = ? 
        ORDER BY date DESC`,
        [username]
      );
      
      return {
        success: true,
        referralCode: user.referral_code,
        history: referralRewards
      };
    } catch (error) {
      reply.status(401);
      return { success: false, message: 'Invalid token' };
    }
  });
};

// Add declaration merging for the referral info
declare module 'fastify' {
  interface FastifyRequest {
    referralInfo?: {
      referrer: string;
      referred: string;
    };
  }
}

export default fastifyPlugin(referralPlugin);