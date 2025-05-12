-- Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
-- 
-- Licensed under the Apache License, Version 2.0 (the "License");
-- you may not use this file except in compliance with the License.
-- You may obtain a copy of the License at
-- 
--     http://www.apache.org/licenses/LICENSE-2.0
-- 
-- Unless required by applicable law or agreed to in writing, software
-- distributed under the License is distributed on an "AS IS" BASIS,
-- WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
-- See the License for the specific language governing permissions and
-- limitations under the License.

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
  coin INTEGER NOT NULL DEFAULT 0,
  referral_code TEXT UNIQUE
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
  date TEXT NOT NULL,
  status TEXT NOT NULL,
  total_price REAL NOT NULL,
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
  username TEXT NOT NULL,
  product_id INTEGER NOT NULL,
  rating INTEGER NOT NULL CHECK(rating BETWEEN 1 AND 5),
  text TEXT NOT NULL,
  date TEXT NOT NULL,
  FOREIGN KEY (username) REFERENCES users(username),
  FOREIGN KEY (product_id) REFERENCES products(id),
  UNIQUE(username, product_id)
);

CREATE TABLE IF NOT EXISTS referrals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  referrer_username TEXT NOT NULL,
  referred_username TEXT NOT NULL UNIQUE,
  registration_rewarded BOOLEAN NOT NULL DEFAULT 0,
  first_order_rewarded BOOLEAN NOT NULL DEFAULT 0,
  date TEXT NOT NULL,
  FOREIGN KEY (referrer_username) REFERENCES users(username),
  FOREIGN KEY (referred_username) REFERENCES users(username)
);

CREATE TABLE IF NOT EXISTS referral_rewards (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  referrer_username TEXT NOT NULL,
  referred_username TEXT NOT NULL,
  reward_amount INTEGER NOT NULL,
  reward_type TEXT NOT NULL, -- 'registration' or 'order'
  date TEXT NOT NULL,
  FOREIGN KEY (referrer_username) REFERENCES users(username),
  FOREIGN KEY (referred_username) REFERENCES users(username)
);

INSERT INTO users (username, password, role, coin, referral_code) VALUES ('admin', '123456', 'admin', 0, 'ADMIN123');
INSERT INTO users (username, password, role, coin, referral_code) VALUES ('user', '123456', 'user', 1000, 'USER123');