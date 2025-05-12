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
import './products.css'

interface Product {
  id: number
  name: string
  price: number
  image: string
  description: string
  quantity: number
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([])
  const router = useRouter()
  
  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch('/api/products')
        const data = await response.json()
        if (data.success) {
          setProducts(data.products)
        }
      } catch (error) {
        console.error('Failed to fetch products:', error)
      }
    }
    
    fetchProducts()
  }, [])

  const handleProductClick = (productId: number) => {
    router.push(`/products/${productId}`)
  }

  return (
    <div>
      <h1>Our Products</h1>
      <div className="product-list">
        {products.map(product => (
          <div 
            className="product-card" 
            id={`product_card_${product.id}`} 
            key={product.id}
            onClick={() => handleProductClick(product.id)}
          >
            <img className="product-image" src={product.image} alt={product.name} />
            <div className="product-name">{product.name}</div>
            <div className="product-price">${product.price}</div>
          </div>
        ))}
      </div>
    </div>
  )
}