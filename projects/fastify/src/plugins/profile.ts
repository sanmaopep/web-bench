import { FastifyPluginAsync } from 'fastify';
import { jwtVerify } from 'jose';
import db from '../libs/db';

const JWT_SECRET = new TextEncoder().encode('WEBBENCH-SECRET');

const profile: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get('/profile/:username', async (request, reply) => {
    const { username } = request.params as { username: string };
    const token = request.cookies.TOKEN;
    
    if (!token) {
      return reply.redirect('/login');
    }
    
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      const loggedInUsername = payload.username as string;
      const userRole = payload.role as string;
      
      // Check permission: users can only view their own profile, admins can view any profile
      if (username !== loggedInUsername && userRole !== 'admin') {
        return reply.redirect('/login');
      }
      
      return new Promise((resolve, reject) => {
        const sql = 'SELECT username, role, coin, referral_code FROM users WHERE username = ?';
        db.get(sql, [username], (err, row) => {
          if (err) {
            fastify.log.error(err);
            return reject(err);
          }
          
          if (!row) {
            return reply.view('profile-not-found.ejs', { 
              title: 'User Not Found',
              username: loggedInUsername
            });
          }
          
          return reply.view('profile.ejs', { 
            title: 'User Profile',
            profile: row,
            currentUser: loggedInUsername
          });
        });
      });
    } catch (err) {
      fastify.log.error(err);
      return reply.redirect('/login');
    }
  });

  fastify.post('/api/profile/recharge', async (request, reply) => {
    const token = request.cookies.TOKEN;
    
    if (!token) {
      return reply.status(401).send({ success: false, error: 'Unauthorized' });
    }
    
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      const username = payload.username as string;
      
      return new Promise<{ success: boolean, newBalance?: number }>((resolve, reject) => {
        const updateSql = 'UPDATE users SET coin = coin + 1000 WHERE username = ?';
        db.run(updateSql, [username], function(err) {
          if (err) {
            fastify.log.error(err);
            return reject(err);
          }
          
          // Get updated coin balance
          const selectSql = 'SELECT coin FROM users WHERE username = ?';
          db.get(selectSql, [username], (err, row) => {
            if (err) {
              fastify.log.error(err);
              return reject(err);
            }
            
            if (!row) {
              return reply.status(404).send({ success: false, error: 'User not found' });
            }
            
            resolve({ success: true, newBalance: row.coin });
          });
        });
      });
    } catch (err) {
      fastify.log.error(err);
      return reply.status(401).send({ success: false, error: 'Invalid token' });
    }
  });
};

export default profile;