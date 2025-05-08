import { db } from '~/libs/db';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { name, price, image, description, quantity } = body;
  
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO products (name, price, image, description, quantity) VALUES (?, ?, ?, ?, ?)',
      [name, price, image, description, quantity],
      function(err) {
        if (err) {
          reject({ success: false, error: err.message });
          return;
        }
        resolve({ success: true, data: { id: this.lastID } });
      }
    );
  });
});