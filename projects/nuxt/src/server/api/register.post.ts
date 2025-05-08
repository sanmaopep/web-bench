import { db, runTransaction } from '~/libs/db';
import { SignJWT } from 'jose';

export default defineEventHandler(async (event) => {
  const { username, password, referralCode } = await readBody(event);
  
  return new Promise((resolve, reject) => {
    // Check if username already exists
    db.get('SELECT username FROM users WHERE username = ?', [username], async (err, row) => {
      if (err) {
        return reject(createError({
          statusCode: 500,
          message: 'Database error'
        }));
      }
      
      if (row) {
        return reject(createError({
          statusCode: 409,
          message: 'Username already exists'
        }));
      }
      
      // Check if referral code is valid
      let referringUser = null;
      if (referralCode) {
        try {
          const result = await new Promise((resolve, reject) => {
            db.get('SELECT username FROM users WHERE username = ?', [referralCode], (err, row) => {
              if (err) reject(err);
              else resolve(row);
            });
          });
          
          if (!result) {
            return reject(createError({
              statusCode: 404,
              message: 'Invalid referral code'
            }));
          }
          
          referringUser = result.username;
        } catch (err) {
          return reject(createError({
            statusCode: 500,
            message: 'Failed to verify referral code'
          }));
        }
      }
      
      try {
        // Create user transaction with referral bonus if applicable
        const transactions = [];
        
        // Add new user
        transactions.push({
          sql: 'INSERT INTO users (username, password, role, coin) VALUES (?, ?, ?, ?)',
          deps: [username, password, 'user', 1000]
        });
        
        // Add referral bonus if applicable
        if (referringUser) {
          transactions.push({
            sql: 'UPDATE users SET coin = coin + 888 WHERE username = ?',
            deps: [referringUser]
          });
          
          // Record this referral for future first-purchase bonus
          transactions.push({
            sql: 'INSERT INTO referrals (referrer, referred, first_purchase_rewarded) VALUES (?, ?, ?)',
            deps: [referringUser, username, 0]
          });
        }
        
        await runTransaction(transactions);
        
        // Generate JWT token
        const secret = new TextEncoder().encode('WEBBENCH-SECRET');
        const token = await new SignJWT({ username, role: 'user' })
          .setProtectedHeader({ alg: 'HS256' })
          .setExpirationTime('1h')
          .sign(secret);
        
        setCookie(event, 'TOKEN', token, {
          httpOnly: true,
          sameSite: 'strict',
          maxAge: 60 * 60 // 1 hour
        });
        
        resolve({ success: true });
      } catch (err) {
        return reject(createError({
          statusCode: 500,
          message: 'Failed to create user'
        }));
      }
    });
  });
});