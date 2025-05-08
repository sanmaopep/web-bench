import { FastifyPluginAsync } from 'fastify';
import db from '../libs/db';
import { getAuth } from './auth';

interface CartItem {
  id?: number;
  user_id: number;
  product_id: number;
  quantity: number;
  name?: string;
  price?: number;
  image?: string;
}

const cart: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  // Add a preHandler hook to check authentication
  fastify.addHook('preHandler', async (request, reply) => {
    if (request.url.startsWith('/api/cart')) {
      const token = request.cookies.TOKEN;
      
      if (!token) {
        return reply.status(401).send({ success: false, error: 'Authentication required' });
      }
      
      try {
        const { username } = await getAuth(token);
        
        if (!username) {
          return reply.status(401).send({ success: false, error: 'Authentication required' });
        }
      } catch (err) {
        fastify.log.error(err);
        return reply.status(401).send({ success: false, error: 'Authentication required' });
      }
    }
  });

  // Get all cart items for the current user
  fastify.get('/api/cart', async (request, reply) => {
    const token = request.cookies.TOKEN;
    const { username } = await getAuth(token);
    
    return new Promise<{ success: boolean, items: CartItem[] }>((resolve, reject) => {
      const sql = `
        SELECT c.id, c.product_id, c.user_id, c.quantity, p.name, p.price, p.image
        FROM cart c
        JOIN products p ON c.product_id = p.id
        JOIN users u ON c.user_id = u.id
        WHERE u.username = ?
      `;
      
      db.all(sql, [username], (err, rows) => {
        if (err) {
          fastify.log.error(err);
          return reject(err);
        }
        
        resolve({ 
          success: true, 
          items: rows as CartItem[] 
        });
      });
    });
  });

  // Add a product to cart
  fastify.post('/api/cart', {
    schema: {
      body: {
        type: 'object',
        required: ['productId', 'quantity'],
        properties: {
          productId: { type: 'number' },
          quantity: { type: 'number', minimum: 1 }
        }
      }
    }
  }, async (request, reply) => {
    const { productId, quantity } = request.body as { productId: number, quantity: number };
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
        
        // Check if product exists in cart already
        db.get(
          'SELECT id, quantity FROM cart WHERE user_id = ? AND product_id = ?',
          [userId, productId],
          (err, cartItem) => {
            if (err) {
              fastify.log.error(err);
              return reject(err);
            }
            
            if (cartItem) {
              // Update quantity if product already in cart
              const newQuantity = (cartItem as { quantity: number }).quantity + quantity;
              db.run(
                'UPDATE cart SET quantity = ? WHERE id = ?',
                [newQuantity, (cartItem as { id: number }).id],
                function(err) {
                  if (err) {
                    fastify.log.error(err);
                    return reject(err);
                  }
                  
                  resolve({ success: true, message: 'Cart updated successfully' });
                }
              );
            } else {
              // Add new product to cart
              db.run(
                'INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)',
                [userId, productId, quantity],
                function(err) {
                  if (err) {
                    fastify.log.error(err);
                    return reject(err);
                  }
                  
                  resolve({ success: true, message: 'Product added to cart' });
                }
              );
            }
          }
        );
      });
    });
  });

  // Update cart item quantity
  fastify.post('/api/cart/update', {
    schema: {
      body: {
        type: 'object',
        required: ['productId', 'quantity'],
        properties: {
          productId: { type: 'number' },
          quantity: { type: 'number', minimum: 1 }
        }
      }
    }
  }, async (request, reply) => {
    const { productId, quantity } = request.body as { productId: number, quantity: number };
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
        
        // Update cart item quantity
        db.run(
          'UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ?',
          [quantity, userId, productId],
          function(err) {
            if (err) {
              fastify.log.error(err);
              return reject(err);
            }
            
            if (this.changes === 0) {
              return resolve({ success: false, message: 'Product not found in cart' });
            }
            
            resolve({ success: true, message: 'Cart updated successfully' });
          }
        );
      });
    });
  });

  // Remove a product from cart
  fastify.delete('/api/cart/:productId', async (request, reply) => {
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
        
        // Remove from cart
        db.run(
          'DELETE FROM cart WHERE user_id = ? AND product_id = ?',
          [userId, productId],
          function(err) {
            if (err) {
              fastify.log.error(err);
              return reject(err);
            }
            
            if (this.changes === 0) {
              return resolve({ success: false, message: 'Product not found in cart' });
            }
            
            resolve({ success: true, message: 'Product removed from cart' });
          }
        );
      });
    });
  });
};

export default cart;