CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  price REAL NOT NULL,
  image TEXT,
  description TEXT,
  quantity INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  role TEXT NOT NULL,
  coin INTEGER NOT NULL,
  referral_code TEXT UNIQUE,
  has_first_purchase BOOLEAN DEFAULT FALSE,
  referrer_referral_code TEXT,
  FOREIGN KEY (referrer_referral_code) REFERENCES users(referral_code)
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
  quantity INTEGER NOT NULL,
  FOREIGN KEY (username) REFERENCES users(username),
  FOREIGN KEY (product_id) REFERENCES products(id),
  UNIQUE(username, product_id)
);

CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL,
  status TEXT NOT NULL,
  total_price REAL NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (username) REFERENCES users(username)
);

CREATE TABLE IF NOT EXISTS order_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL,
  price REAL NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE IF NOT EXISTS comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  rating INTEGER NOT NULL,
  comment TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (product_id) REFERENCES products(id),
  UNIQUE(user_id, product_id)
);

INSERT INTO users (username, password, role, coin, referral_code) VALUES ('admin', '123456', 'admin', 0, 'ADMIN123');
INSERT INTO users (username, password, role, coin, referral_code) VALUES ('user', '123456', 'user', 1000, 'USER1234');