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

import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/actions/auth'
import Wishlist from '@/model/wishlist'
import Product from '@/model/product'
import RemoveFromWishlistButton from './RemoveFromWishlistButton'
import './style.css'

export default async function WishlistPage() {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    redirect('/login')
  }

  const wishlistItems = await Wishlist.find({ username: currentUser.username })
  const products = await Promise.all(wishlistItems.map((item) => Product.findById(item.productId)))

  if (products.length === 0) {
    return (
      <div className="wishlist-container">
        <h1 className="wishlist-title">My Wishlist</h1>
        <div className="empty-wishlist">Your wishlist is empty</div>
      </div>
    )
  }

  return (
    <div className="wishlist-container">
      <h1 className="wishlist-title">My Wishlist</h1>
      {products.map((product) => (
        <div
          key={String(product._id)}
          className="wishlist-item"
          id={`wishlist_item_${product._id}`}
        >
          <img className="wishlist-image" src={product.image} alt={product.name} />
          <div className="wishlist-info">
            <div className="wishlist-name">{product.name}</div>
            <div className="wishlist-price">${product.price}</div>
          </div>
          <RemoveFromWishlistButton productId={String(product._id)} />
        </div>
      ))}
    </div>
  )
}
