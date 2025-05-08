CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  price REAL NOT NULL,
  image TEXT NOT NULL,
  description TEXT NOT NULL,
  quantity INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  role TEXT NOT NULL,
  coin INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS wishlist (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL,
  product_id INTEGER NOT NULL,
  FOREIGN KEY (username) REFERENCES users(username),
  FOREIGN KEY (product_id) REFERENCES products(id),
  UNIQUE(username, product_id)
);

CREATE TABLE IF NOT EXISTS cart (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL,
  product_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  FOREIGN KEY (username) REFERENCES users(username),
  FOREIGN KEY (product_id) REFERENCES products(id),
  UNIQUE(username, product_id)
);

CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at TEXT NOT NULL,
  total_price REAL NOT NULL,
  FOREIGN KEY (username) REFERENCES users(username)
);

CREATE TABLE IF NOT EXISTS order_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE IF NOT EXISTS comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL,
  product_id INTEGER NOT NULL,
  rating INTEGER NOT NULL,
  comment TEXT NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY (username) REFERENCES users(username),
  FOREIGN KEY (product_id) REFERENCES products(id),
  UNIQUE(username, product_id)
);

CREATE TABLE IF NOT EXISTS referrals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  referrer TEXT NOT NULL,
  referred TEXT NOT NULL,
  first_purchase_rewarded INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY (referrer) REFERENCES users(username),
  FOREIGN KEY (referred) REFERENCES users(username),
  UNIQUE(referred)
);

INSERT OR IGNORE INTO users (username, password, role, coin) VALUES ('admin', '123456', 'admin', 0);
INSERT OR IGNORE INTO users (username, password, role, coin) VALUES ('user', '123456', 'user', 1000);