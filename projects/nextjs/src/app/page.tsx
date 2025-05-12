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

export default async function Home() {
  const user = await getCurrentUser()

  return (
    <div>
      <h1>🛍️🛍️🛍️ Welcome to Shopping Mart !</h1>
      <h1>Hello {user?.username || 'Guest'}!</h1>
      <a href="/products">
        <button className="home-go-products-link">View Products</button>
      </a>
      {user && (
        <a href="/wishlist">
          <button className="home-go-wish-list">My Wishlist</button>
        </a>
      )}
      {user?.role === 'admin' && (
        <>
          <a href="/admin/products">
            <button className="home-go-product-portal-link">Product Portal</button>
          </a>
          <a href="/admin/users">
            <button className="home-go-user-portal-link">User Portal</button>
          </a>
          <a href="/admin/orders">
            <button className="home-go-order-portal-link">Order Portal</button>
          </a>
        </>
      )}
    </div>
  )
}
