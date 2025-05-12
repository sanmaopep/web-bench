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
import db, { runTransaction, TransactionSQL } from '../libs/db';
import { getAuth } from './auth';

interface OrderItem {
  product_id: number;
  quantity: number;
  name: string;
  price: number;
  image: string;
}

interface Order {
  id: number;
  user_id: number;
  status: string;
  total_price: number;
  created_at: string;
  items?: OrderItem[];
}

const order: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  // Add a preHandler hook to check authentication
  fastify.addHook('preHandler', async (request, reply) => {
    if (request.url.startsWith('/api/orders') || request.url.startsWith('/orders') || request.url.startsWith('/order/')) {
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

  // Place a new order
  fastify.post('/api/orders', async (request, reply) => {
    const token = request.cookies.TOKEN;
    const { username } = await getAuth(token);
    
    // Get user_id
    const getUserPromise = new Promise<{ id: number }>((resolve, reject) => {
      db.get('SELECT id FROM users WHERE username = ?', [username], (err, user) => {
        if (err) {
          fastify.log.error(err);
          return reject(err);
        }
        
        if (!user) {
          return reject(new Error('User not found'));
        }
        
        resolve(user as { id: number });
      });
    });
    
    try {
      const user = await getUserPromise;
      const userId = user.id;
      
      // Get cart items for the user
      const cartItemsPromise = new Promise<any[]>((resolve, reject) => {
        const cartSql = `
          SELECT c.product_id, c.quantity, p.name, p.price, p.image 
          FROM cart c 
          JOIN products p ON c.product_id = p.id 
          WHERE c.user_id = ?
        `;
        
        db.all(cartSql, [userId], (err, cartItems) => {
          if (err) {
            fastify.log.error(err);
            return reject(err);
          }
          
          resolve(cartItems);
        });
      });
      
      const cartItems = await cartItemsPromise;
      
      if (!cartItems || cartItems.length === 0) {
        return { success: false, message: 'Cart is empty' };
      }
      
      // Calculate total price
      const totalPrice = cartItems.reduce((sum: number, item: any) => {
        return sum + (item.price * item.quantity);
      }, 0);
      
      // Create a new order and insert order items
      const createOrderPromise = new Promise<number>((resolve, reject) => {
        db.run(
          'INSERT INTO orders (user_id, status, total_price) VALUES (?, ?, ?)',
          [userId, 'Pending payment', totalPrice],
          function(err) {
            if (err) {
              fastify.log.error(err);
              return reject(err);
            }
            
            resolve(this.lastID);
          }
        );
      });
      
      const orderId = await createOrderPromise;
      
      // Insert order items as a transaction
      const orderItemsOps: TransactionSQL[] = cartItems.map((item: any) => ({
        sql: 'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
        deps: [orderId, item.product_id, item.quantity, item.price]
      }));
      
      await runTransaction(orderItemsOps);
      
      // Clear the cart
      const clearCartPromise = new Promise<void>((resolve, reject) => {
        db.run('DELETE FROM cart WHERE user_id = ?', [userId], (err) => {
          if (err) {
            fastify.log.error(err);
            return reject(err);
          }
          
          resolve();
        });
      });
      
      await clearCartPromise;
      
      return { success: true, orderId };
    } catch (err) {
      fastify.log.error(err);
      return { success: false, message: 'Failed to create order' };
    }
  });

  // Get order details
  fastify.get('/api/orders/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const token = request.cookies.TOKEN;
    const { username } = await getAuth(token);
    
    try {
      // Get user_id
      const userPromise = new Promise<{ id: number, role: string }>((resolve, reject) => {
        db.get('SELECT id, role FROM users WHERE username = ?', [username], (err, user) => {
          if (err) {
            fastify.log.error(err);
            return reject(err);
          }
          
          if (!user) {
            return reject(new Error('User not found'));
          }
          
          resolve(user as { id: number, role: string });
        });
      });
      
      const user = await userPromise;
      const userId = user.id;
      const userRole = user.role;
      
      // Get order details
      const orderPromise = new Promise<Order | null>((resolve, reject) => {
        const orderSql = 'SELECT * FROM orders WHERE id = ?';
        db.get(orderSql, [id], (err, order) => {
          if (err) {
            fastify.log.error(err);
            return reject(err);
          }
          
          if (!order) {
            return resolve(null);
          }
          
          resolve(order as Order);
        });
      });
      
      const orderData = await orderPromise;
      
      if (!orderData) {
        return { success: false };
      }
      
      // Check if user has permission to view this order
      if (orderData.user_id !== userId && userRole !== 'admin') {
        return { success: false };
      }
      
      // Get order items
      const itemsPromise = new Promise<OrderItem[]>((resolve, reject) => {
        const itemsSql = `
          SELECT oi.product_id, oi.quantity, oi.price, p.name, p.image
          FROM order_items oi
          JOIN products p ON oi.product_id = p.id
          WHERE oi.order_id = ?
        `;
        
        db.all(itemsSql, [id], (err, items) => {
          if (err) {
            fastify.log.error(err);
            return reject(err);
          }
          
          resolve(items as OrderItem[]);
        });
      });
      
      const items = await itemsPromise;
      orderData.items = items;
      
      return { success: true, order: orderData };
    } catch (err) {
      fastify.log.error(err);
      return { success: false };
    }
  });

  // Get all orders for the current user
  fastify.get('/api/orders', async (request, reply) => {
    const token = request.cookies.TOKEN;
    const { username } = await getAuth(token);
    
    try {
      // Get user_id
      const userPromise = new Promise<{ id: number }>((resolve, reject) => {
        db.get('SELECT id FROM users WHERE username = ?', [username], (err, user) => {
          if (err) {
            fastify.log.error(err);
            return reject(err);
          }
          
          if (!user) {
            return reject(new Error('User not found'));
          }
          
          resolve(user as { id: number });
        });
      });
      
      const user = await userPromise;
      const userId = user.id;
      
      // Get all orders for the user
      const ordersPromise = new Promise<Order[]>((resolve, reject) => {
        const ordersSql = 'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC';
        db.all(ordersSql, [userId], (err, orders) => {
          if (err) {
            fastify.log.error(err);
            return reject(err);
          }
          
          resolve(orders as Order[]);
        });
      });
      
      const orders = await ordersPromise;
      
      return { success: true, orders };
    } catch (err) {
      fastify.log.error(err);
      return { success: false, orders: [] };
    }
  });

  // Pay for an order
  fastify.post('/api/orders/:id/pay', async (request, reply) => {
    const { id } = request.params as { id: string };
    const token = request.cookies.TOKEN;
    const { username } = await getAuth(token);
    
    try {
      // Get user_id and coin balance
      const userPromise = new Promise<{ id: number, coin: number, referrer_id: number, is_first_order: number }>((resolve, reject) => {
        db.get('SELECT id, coin, referrer_id, is_first_order FROM users WHERE username = ?', [username], (err, user) => {
          if (err) {
            fastify.log.error(err);
            return reject(err);
          }
          
          if (!user) {
            return reject(new Error('User not found'));
          }
          
          resolve(user as { id: number, coin: number, referrer_id: number, is_first_order: number });
        });
      });
      
      const user = await userPromise;
      const userId = user.id;
      const userCoins = user.coin;
      const referrerId = user.referrer_id;
      const isFirstOrder = user.is_first_order;

      // Get order details
      const orderPromise = new Promise<Order | null>((resolve, reject) => {
        db.get('SELECT * FROM orders WHERE id = ? AND user_id = ? AND status = ?', 
          [id, userId, 'Pending payment'], (err, order) => {
          if (err) {
            fastify.log.error(err);
            return reject(err);
          }
          
          if (!order) {
            return resolve(null);
          }
          
          resolve(order as Order);
        });
      });
      
      const orderData = await orderPromise;
      
      if (!orderData) {
        return { success: false, message: 'Order not found or already processed' };
      }
      
      // Check if user has enough coins
      if (userCoins < orderData.total_price) {
        // Update order status to Failed
        await new Promise<void>((resolve, reject) => {
          db.run('UPDATE orders SET status = ? WHERE id = ?', ['Failed', id], (err) => {
            if (err) {
              fastify.log.error(err);
              return reject(err);
            }
            resolve();
          });
        });
        
        return { success: false, message: 'Insufficient funds' };
      }
      
      // Get order items
      const itemsPromise = new Promise<{ product_id: number, quantity: number }[]>((resolve, reject) => {
        db.all('SELECT product_id, quantity FROM order_items WHERE order_id = ?', [id], (err, items) => {
          if (err) {
            fastify.log.error(err);
            return reject(err);
          }
          
          resolve(items as { product_id: number, quantity: number }[]);
        });
      });
      
      const items = await itemsPromise;
      
      if (items.length === 0) {
        // No items in order (shouldn't happen)
        await new Promise<void>((resolve, reject) => {
          db.run('UPDATE orders SET status = ? WHERE id = ?', ['Failed', id], (err) => {
            if (err) {
              fastify.log.error(err);
              return reject(err);
            }
            resolve();
          });
        });
        
        return { success: false, message: 'No items in order' };
      }
      
      // Get all product quantities in one go
      const productIds = items.map(item => item.product_id);
      const placeholders = productIds.map(() => '?').join(',');
      
      const productsPromise = new Promise<{ id: number, quantity: number }[]>((resolve, reject) => {
        db.all(`SELECT id, quantity FROM products WHERE id IN (${placeholders})`, productIds, (err, products) => {
          if (err) {
            fastify.log.error(err);
            return reject(err);
          }
          
          resolve(products as { id: number, quantity: number }[]);
        });
      });
      
      const products = await productsPromise;
      
      // Check if all products have enough quantity
      const productMap = new Map();
      products.forEach(product => {
        productMap.set(product.id, product.quantity);
      });
      
      const insufficientProducts = items.some(item => {
        const available = productMap.get(item.product_id) || 0;
        return available < item.quantity;
      });
      
      if (insufficientProducts) {
        // Not enough quantity for at least one product
        await new Promise<void>((resolve, reject) => {
          db.run('UPDATE orders SET status = ? WHERE id = ?', ['Failed', id], (err) => {
            if (err) {
              fastify.log.error(err);
              return reject(err);
            }
            resolve();
          });
        });
        
        return { success: false, message: 'Insufficient product quantity' };
      }
      
      // All checks passed, execute transaction
      const transactionOps: TransactionSQL[] = [
        // Update user's coin balance
        {
          sql: 'UPDATE users SET coin = coin - ?, is_first_order = 1 WHERE id = ?',
          deps: [orderData.total_price, userId]
        },
        // Update order status
        {
          sql: 'UPDATE orders SET status = ? WHERE id = ?',
          deps: ['Finished', id]
        }
      ];
      
      // Add operations to update product quantities
      items.forEach(item => {
        transactionOps.push({
          sql: 'UPDATE products SET quantity = quantity - ? WHERE id = ?',
          deps: [item.quantity, item.product_id]
        });
      });

      if (referrerId && isFirstOrder === 0) {
        transactionOps.push({
          sql: 'UPDATE users SET coin = coin + 1888 WHERE id = ?',
          deps: [referrerId]
        })
      }

      // Execute all update operations in a single transaction
      await runTransaction(transactionOps);
      
      return { success: true };
    } catch (err) {
      fastify.log.error(err);
      return { success: false, message: 'Payment processing failed' };
    }
  });

  // Request a refund
  fastify.post('/api/orders/:id/refund', async (request, reply) => {
    const { id } = request.params as { id: string };
    const token = request.cookies.TOKEN;
    const { username } = await getAuth(token);
    
    try {
      // Get user_id
      const userPromise = new Promise<{ id: number }>((resolve, reject) => {
        db.get('SELECT id FROM users WHERE username = ?', [username], (err, user) => {
          if (err) {
            fastify.log.error(err);
            return reject(err);
          }
          
          if (!user) {
            return reject(new Error('User not found'));
          }
          
          resolve(user as { id: number });
        });
      });
      
      const user = await userPromise;
      const userId = user.id;
      
      // Check if order exists and belongs to the user
      const orderPromise = new Promise<Order | null>((resolve, reject) => {
        db.get('SELECT * FROM orders WHERE id = ? AND user_id = ? AND status = ?', 
          [id, userId, 'Finished'], (err, order) => {
          if (err) {
            fastify.log.error(err);
            return reject(err);
          }
          
          if (!order) {
            return resolve(null);
          }
          
          resolve(order as Order);
        });
      });
      
      const orderData = await orderPromise;
      
      if (!orderData) {
        return { success: false, message: 'Order not found or not eligible for refund' };
      }
      
      // Update order status to Refund Reviewing
      await new Promise<void>((resolve, reject) => {
        db.run('UPDATE orders SET status = ? WHERE id = ?', ['Refund Reviewing', id], (err) => {
          if (err) {
            fastify.log.error(err);
            return reject(err);
          }
          resolve();
        });
      });
      
      return { success: true };
    } catch (err) {
      fastify.log.error(err);
      return { success: false, message: 'Failed to request refund' };
    }
  });

  // Process a refund (admin only)
  fastify.post('/api/orders/:id/process-refund', async (request, reply) => {
    const { id } = request.params as { id: string };
    const token = request.cookies.TOKEN;
    const { username, role } = await getAuth(token);
    
    if (role !== 'admin') {
      return { success: false, message: 'Unauthorized' };
    }
    
    try {
      // Get order details
      const orderPromise = new Promise<Order | null>((resolve, reject) => {
        db.get('SELECT * FROM orders WHERE id = ? AND status = ?', 
          [id, 'Refund Reviewing'], (err, order) => {
          if (err) {
            fastify.log.error(err);
            return reject(err);
          }
          
          if (!order) {
            return resolve(null);
          }
          
          resolve(order as Order);
        });
      });
      
      const orderData = await orderPromise;
      
      if (!orderData) {
        return { success: false, message: 'Order not found or not in refund review status' };
      }
      
      // Process the refund in a transaction
      await runTransaction([
        // Update order status
        {
          sql: 'UPDATE orders SET status = ? WHERE id = ?',
          deps: ['Refund Passed', id]
        },
        // Refund coins to user
        {
          sql: 'UPDATE users SET coin = coin + ? WHERE id = ?',
          deps: [orderData.total_price, orderData.user_id]
        }
      ]);
      
      return { success: true };
    } catch (err) {
      fastify.log.error(err);
      return { success: false, message: 'Failed to process refund' };
    }
  });

  // Get all orders (admin only)
  fastify.get('/api/admin/orders', async (request, reply) => {
    const token = request.cookies.TOKEN;
    const { role } = await getAuth(token);
    
    if (role !== 'admin') {
      return reply.status(403).send({ success: false, message: 'Unauthorized' });
    }
    
    try {
      // Get all orders
      const ordersPromise = new Promise<Order[]>((resolve, reject) => {
        const ordersSql = 'SELECT o.*, u.username FROM orders o JOIN users u ON o.user_id = u.id ORDER BY o.created_at DESC';
        db.all(ordersSql, [], (err, orders) => {
          if (err) {
            fastify.log.error(err);
            return reject(err);
          }
          
          resolve(orders as (Order & { username: string })[]);
        });
      });
      
      const orders = await ordersPromise;
      
      return { success: true, orders };
    } catch (err) {
      fastify.log.error(err);
      return { success: false, orders: [] };
    }
  });

  // Order detail page
  fastify.get('/order/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    return reply.view('order-detail.ejs', { 
      title: `Order #${id}`,
      orderId: id
    });
  });

  // Orders list page
  fastify.get('/orders', async (request, reply) => {
    return reply.view('orders.ejs', { 
      title: 'My Orders'
    });
  });

  // Admin orders page
  fastify.get('/admin/orders', async (request, reply) => {
    const token = request.cookies.TOKEN;
    try {
      const { role } = await getAuth(token);
      
      if (role !== 'admin') {
        return reply.redirect('/login');
      }
      
      return reply.view('admin-orders.ejs', { 
        title: 'Admin - Order Management'
      });
    } catch (err) {
      fastify.log.error(err);
      return reply.redirect('/login');
    }
  });
};

export default order;