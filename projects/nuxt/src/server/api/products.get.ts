import { db } from '~/libs/db';

export default defineEventHandler(async (event) => {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM products', (err, rows) => {
      if (err) {
        reject({ success: false, error: err.message });
        return;
      }
      resolve({ success: true, products: rows });
    });
  });
});