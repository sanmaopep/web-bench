import { FastifyPluginAsync } from 'fastify';
import fastifyPlugin from 'fastify-plugin';
import { db, runTransaction } from '../libs/db';
import * as jose from 'jose';
import crypto from 'crypto';

interface RegisterRequest {
  username: string;
  password: string;
  referralCode?: string;
}

const SECRET = new TextEncoder().encode('WEBBENCH-SECRET');

const registerPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.post<{ Body: RegisterRequest }>('/api/register', async (request, reply) => {
    const { username, password, referralCode } = request.body;
    
    return new Promise<{ success: boolean; message?: string }>(async (resolve, reject) => {
      try {
        // Check if username already exists
        const existingUser = await new Promise<any>((resolve, reject) => {
          db.get('SELECT username FROM users WHERE username = ?', [username], (err, row) => {
            if (err) reject(err);
            else resolve(row);
          });
        });
        
        if (existingUser) {
          resolve({ success: false, message: 'Username already exists' });
          return;
        }
        
        // Generate referral code for the new user
        const newReferralCode = await generateReferralCode(username);
        
        // Check if a valid referral code was provided
        let referrerUsername = null;
        if (referralCode) {
          const referrer = await new Promise<any>((resolve, reject) => {
            db.get('SELECT username FROM users WHERE referral_code = ?', [referralCode], (err, row) => {
              if (err) reject(err);
              else resolve(row);
            });
          });
          
          if (referrer) {
            referrerUsername = referrer.username;
          }
        }
        
        // Create the new user and handle any referral 
        if (referrerUsername) {
          // Use transaction to ensure both user creation and referral processing
          const REGISTRATION_REWARD = 888;
          
          await runTransaction([
            {
              sql: 'INSERT INTO users (username, password, role, coin, referral_code) VALUES (?, ?, ?, ?, ?)',
              deps: [username, password, 'user', 1000, newReferralCode]
            },
            {
              sql: 'UPDATE users SET coin = coin + ? WHERE username = ?',
              deps: [REGISTRATION_REWARD, referrerUsername]
            },
            {
              sql: 'INSERT INTO referrals (referrer_username, referred_username, registration_rewarded, date) VALUES (?, ?, 1, ?)',
              deps: [referrerUsername, username, new Date().toISOString()]
            },
            {
              sql: 'INSERT INTO referral_rewards (referrer_username, referred_username, reward_amount, reward_type, date) VALUES (?, ?, ?, ?, ?)',
              deps: [referrerUsername, username, REGISTRATION_REWARD, 'registration', new Date().toISOString()]
            }
          ]);
        } else {
          // Just create the user without referral processing
          await new Promise<void>((resolve, reject) => {
            const stmt = db.prepare(
              'INSERT INTO users (username, password, role, coin, referral_code) VALUES (?, ?, ?, ?, ?)'
            );
            
            stmt.run([username, password, 'user', 1000, newReferralCode], function(err) {
              if (err) reject(err);
              else resolve();
            });
            
            stmt.finalize();
          });
        }
        
        // Generate JWT for auto login
        const token = await new jose.SignJWT({ 
          username: username, 
          role: 'user' 
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
      } catch (error) {
        console.error("Registration error:", error);
        reject(error);
      }
    });
  });
  
  // Helper function to generate a unique referral code
  const generateReferralCode = async (username: string): Promise<string> => {
    // Create a base code using a combination of username and random string
    const hash = crypto.createHash('sha256').update(username + Date.now().toString()).digest('hex');
    const baseCode = hash.substring(0, 8).toUpperCase();
    
    // Check if code already exists and regenerate if needed
    const existingCode = await new Promise<any>((resolve, reject) => {
      db.get('SELECT referral_code FROM users WHERE referral_code = ?', [baseCode], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
    
    if (existingCode) {
      // Try again with a different code
      return generateReferralCode(username + '1');
    }
    
    return baseCode;
  };
};

export default fastifyPlugin(registerPlugin);