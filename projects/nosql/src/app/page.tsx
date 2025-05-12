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

import Link from 'next/link'
import { getCurrentUser } from '@/actions/auth'

export default async function HomePage() {
  const user = await getCurrentUser()

  return (
    <div>
      {user ? <h1>Hello {user.username}!</h1> : null}
      <h1>🛍️🛍️🛍️ Welcome to Shopping Mart !</h1>
      <Link href="/products" className="home-go-products-link">
        View Products
      </Link>
      {user?.role === 'admin' && (
        <>
          <Link href="/admin/products" className="home-go-product-portal-link">
            Product Portal
          </Link>
          <Link href="/admin/users" className="home-go-user-portal-link">
            User Portal
          </Link>
          <Link href="/admin/orders" className="home-go-order-portal-link">
            Order Portal
          </Link>
        </>
      )}
      {user && (
        <Link href="/wishlist" className="home-go-wish-list">
          My Wishlist
        </Link>
      )}
    </div>
  )
}