import { FastifyPluginAsync } from 'fastify';
import db from '../libs/db';
import { getAuth } from './auth';

interface User {
  id: number;
  username: string;
  password: string;
  role: string;
  coin: number;
}

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  quantity: number;
}

const admin: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  // Add a preHandler hook for all admin routes to check admin privileges
  fastify.addHook('preHandler', async (request, reply) => {
    if (request.url.startsWith('/admin')) {
      const token = request.cookies.TOKEN;
      
      if (!token) {
        return reply.redirect('/login');
      }
      
      try {
          const { role } = await getAuth(token);
        
        if (role !== 'admin') {
          return reply.redirect('/login');
        }
      } catch (err) {
        fastify.log.error(err);
        return reply.redirect('/login');
      }
    }
  });

  fastify.get('/admin/products', async (request, reply) => {
    return new Promise<void>((resolve, reject) => {
      const sql = 'SELECT * FROM products';
      db.all(sql, [], (err, products) => {
        if (err) {
          fastify.log.error(err);
          return reject(err);
        }
        
        return reply.view('admin-products.ejs', { 
          title: 'Admin - Product Management',
          products: products as Product[]
        });
      });
    });
  });

  fastify.get('/admin/users', async (request, reply) => {
    return new Promise<void>((resolve, reject) => {
      const sql = 'SELECT id, username, role, coin FROM users';
      db.all(sql, [], (err, users) => {
        if (err) {
          fastify.log.error(err);
          return reject(err);
        }
        
        return reply.view('admin-users.ejs', { 
          title: 'Admin - User Management',
          users: users as User[]
        });
      });
    });
  });
};

export default admin;