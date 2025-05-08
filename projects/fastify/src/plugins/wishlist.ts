import { FastifyPluginAsync } from 'fastify';
import db from '../libs/db';
import { getAuth } from './auth';

interface WishlistItem {
  id: number;
  product_id: number;
  user_id: number;
  name: string;
  price: number;
  image: string;
  description: string;
}

const wishlist: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  // Add a preHandler hook to check authentication
  fastify.addHook('preHandler', async (request, reply) => {
    if (request.url === '/wishlist' || request.url.startsWith('/api/wishlist')) {
      const token = request.cookies.TOKEN;
      
      if (!token) {
        if (request.url.startsWith('/api/')) {
          return reply.status(401).send({ success: false, error: 'Authentication required' });
        }
        return reply.redirect('/login');
      }
      
      try {
        const { username } = await getAuth(token);
        
        if (!username) {
          if (request.url.startsWith('/api/')) {
            return reply.status(401).send({ success: false, error: 'Authentication required' });
          }
          return reply.redirect('/login');
        }
      } catch (err) {
        fastify.log.error(err);
        if (request.url.startsWith('/api/')) {
          return reply.status(401).send({ success: false, error: 'Authentication required' });
        }
        return reply.redirect('/login');
      }
    }
  });

  // Get wishlist page
  fastify.get('/wishlist', async (request, reply) => {
    const token = request.cookies.TOKEN;
    const { username } = await getAuth(token);
    
    return reply.view('wishlist.ejs', {
      title: 'My Wishlist',
      username
    });
  });

  // Get all wishlist items for the current user
  fastify.get('/api/wishlist', async (request, reply) => {
    const token = request.cookies.TOKEN;
    const { username } = await getAuth(token);
    
    return new Promise<{ success: boolean, items: WishlistItem[] }>((resolve, reject) => {
      const sql = `
        SELECT w.id, w.product_id, w.user_id, p.name, p.price, p.image, p.description 
        FROM wishlist w
        JOIN products p ON w.product_id = p.id
        JOIN users u ON w.user_id = u.id
        WHERE u.username = ?
      `;
      
      db.all(sql, [username], (err, rows) => {
        if (err) {
          fastify.log.error(err);
          return reject(err);
        }
        
        resolve({ 
          success: true, 
          items: rows as WishlistItem[] 
        });
      });
    });
  });

  // Add a product to wishlist
  fastify.post('/api/wishlist', {
    schema: {
      body: {
        type: 'object',
        required: ['productId'],
        properties: {
          productId: { type: 'number' }
        }
      }
    }
  }, async (request, reply) => {
    const { productId } = request.body as { productId: number };
    const token = request.cookies.TOKEN;
    const { username } = await getAuth(token);
    
    return new Promise<{ success: boolean, message?: string }>((resolve, reject) => {
      // First get the user_id
      db.get('SELECT id FROM users WHERE username = ?', [username], (err, user) => {
        if (err) {
          fastify.log.error(err);
          return reject(err);
        }
        
        if (!user) {
          return resolve({ success: false, message: 'User not found' });
        }
        
        const userId = (user as { id: number }).id;
        
        // Now add to wishlist
        const sql = 'INSERT OR IGNORE INTO wishlist (user_id, product_id) VALUES (?, ?)';
        
        db.run(sql, [userId, productId], function(err) {
          if (err) {
            fastify.log.error(err);
            return reject(err);
          }
          
          if (this.changes === 0) {
            return resolve({ success: true, message: 'Product already in wishlist' });
          }
          
          resolve({ success: true, message: 'Product added to wishlist' });
        });
      });
    });
  });

  // Remove a product from wishlist
  fastify.delete('/api/wishlist/:productId', async (request, reply) => {
    const { productId } = request.params as { productId: string };
    const token = request.cookies.TOKEN;
    const { username } = await getAuth(token);
    
    return new Promise<{ success: boolean, message?: string }>((resolve, reject) => {
      // First get the user_id
      db.get('SELECT id FROM users WHERE username = ?', [username], (err, user) => {
        if (err) {
          fastify.log.error(err);
          return reject(err);
        }
        
        if (!user) {
          return resolve({ success: false, message: 'User not found' });
        }
        
        const userId = (user as { id: number }).id;
        
        // Now remove from wishlist
        const sql = 'DELETE FROM wishlist WHERE user_id = ? AND product_id = ?';
        
        db.run(sql, [userId, productId], function(err) {
          if (err) {
            fastify.log.error(err);
            return reject(err);
          }
          
          if (this.changes === 0) {
            return resolve({ success: false, message: 'Product not found in wishlist' });
          }
          
          resolve({ success: true, message: 'Product removed from wishlist' });
        });
      });
    });
  });

  // Check if a product is in the user's wishlist
  fastify.get('/api/wishlist/check/:productId', async (request, reply) => {
    const { productId } = request.params as { productId: string };
    const token = request.cookies.TOKEN;
    
    if (!token) {
      return { success: true, inWishlist: false };
    }
    
    try {
      const { username } = await getAuth(token);
      
      if (!username) {
        return { success: true, inWishlist: false };
      }
      
      return new Promise<{ success: boolean, inWishlist: boolean }>((resolve, reject) => {
        // First get the user_id
        db.get('SELECT id FROM users WHERE username = ?', [username], (err, user) => {
          if (err) {
            fastify.log.error(err);
            return reject(err);
          }
          
          if (!user) {
            return resolve({ success: true, inWishlist: false });
          }
          
          const userId = (user as { id: number }).id;
          
          // Check if product is in wishlist
          const sql = 'SELECT 1 FROM wishlist WHERE user_id = ? AND product_id = ?';
          
          db.get(sql, [userId, productId], (err, row) => {
            if (err) {
              fastify.log.error(err);
              return reject(err);
            }
            
            resolve({ success: true, inWishlist: !!row });
          });
        });
      });
    } catch (err) {
      fastify.log.error(err);
      return { success: true, inWishlist: false };
    }
  });
};

export default wishlist;