const db = require('../../libs/db')

function getHasPurchased(username, product_id) {
  return new Promise((resolve) => {
    db.get(
      'SELECT 1 FROM orders o JOIN order_items oi ON o.id = oi.order_id WHERE o.username = ? AND oi.product_id = ? AND o.status = "Finished" LIMIT 1',
      [username, product_id],
      (err, row) => {
        if (err) {
          resolve(false)
        } else {
          resolve(Boolean(row))
        }
      }
    )
  })
}

function getHasCommented(username, product_id) {
  return new Promise((resolve) => {
    db.get(
      'SELECT 1 FROM comments WHERE user_id = (SELECT id FROM users WHERE username =?) AND product_id =? LIMIT 1',
      [username, product_id],
      (err, row) => {
        if (err) {
          resolve(false)
        } else {
          resolve(Boolean(row))
        }
      }
    )
  })
}

module.exports = {
  getHasPurchased,
  getHasCommented,
}
