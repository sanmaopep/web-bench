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

import { getCurrentUser } from '@/actions/auth'
import './home.css'

export default async function Home() {
  const user = await getCurrentUser()

  return (
    <div className="home-container">
      <h1>🛍️🛍️🛍️ Welcome to Shopping Mart !</h1>
      {user && <h1>Hello {user.username}!</h1>}

      <div className="home-buttons">
        {!user && (
          <a href="/login" className="login-link">
            <button>Login</button>
          </a>
        )}

        <a href="/products" className="home-go-products-link">
          <button>Browse Products</button>
        </a>

        {user && (
          <a href="/wishlist" className="home-go-wish-list">
            <button>My Wishlist</button>
          </a>
        )}

        {user && user.role === 'admin' && (
          <>
            <a href="/admin/products" className="home-go-product-portal-link">
              <button>Product Portal</button>
            </a>
            <a href="/admin/users" className="home-go-user-portal-link">
              <button>User Portal</button>
            </a>
            <a href="/admin/orders" className="home-go-order-portal-link">
              <button>Order Portal</button>
            </a>
          </>
        )}
      </div>
    </div>
  )
}