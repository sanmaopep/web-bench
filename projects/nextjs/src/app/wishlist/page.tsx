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

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import './wishlist.css'
import { useAuth } from '@/context/auth'

interface Product {
  id: number
  name: string
  price: number
  image: string
}

export default function Wishlist() {
  const [wishlist, setWishlist] = useState<Product[]>([])
  const router = useRouter()
  const { auth } = useAuth()

  useEffect(() => {
    if (!auth) {
      router.push('/login')
    } else {
      fetchWishlist()
    }
  }, [auth, router])

  const fetchWishlist = () => {
    fetch('/api/wishlist')
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setWishlist(data.wishlist)
        }
      })
  }

  const removeFromWishlist = async (productId: number) => {
    const response = await fetch('/api/wishlist', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product_id: productId }),
    })
    const data = await response.json()
    if (data.success) {
      fetchWishlist()
    }
  }

  return (
    <div className="wishlist-container">
      <h1>My Wishlist</h1>
      {wishlist.map((product) => (
        <div key={product.id} className="wishlist-item" id={`wishlist_item_${product.id}`}>
          <img className="wishlist-image" src={product.image} alt={product.name} />
          <div className="wishlist-name">{product.name}</div>
          <div className="wishlist-price">${product.price.toFixed(2)}</div>
          <button className="remove-from-wishlist" onClick={() => removeFromWishlist(product.id)}>
            Remove
          </button>
        </div>
      ))}
    </div>
  )
}
