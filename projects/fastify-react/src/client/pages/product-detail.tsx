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

import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import './product-detail.css'
import AddToWishlist from '../components/AddToWishlist'
import ProductRating from '../components/ProductRating'

interface Product {
  id: number
  name: string
  price: number
  image: string
  description: string
  quantity: number
}

const ProductDetail = () => {
  const { product_id } = useParams<{ product_id: string }>()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(
    null
  )
  const navigate = useNavigate()

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${product_id}`)
        const data = await response.json()

        if (data.success) {
          setProduct(data.product)
        } else {
          setError('Failed to load product')
        }
      } catch (err) {
        setError('Error connecting to server')
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [product_id])

  const handleAddToCart = async () => {
    if (!product) return

    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId: product.id, quantity: 1 }),
      })

      const data = await response.json()

      if (data.success) {
        window.dispatchEvent(new Event('cartUpdated'))
      } else {
        setFeedback({
          message: data.message || 'Failed to add to cart',
          type: 'error',
        })
      }
    } catch (err) {
      setFeedback({
        message: 'Error adding to cart',
        type: 'error',
      })
    }

    // Clear feedback after 3 seconds
    setTimeout(() => {
      setFeedback(null)
    }, 3000)
  }

  if (loading) return <div className="products-loading">Loading product...</div>
  if (error) return <div className="products-error">{error}</div>
  if (!product) return <div className="product-not-found">Product Not Found</div>

  return (
    <div className="product-detail-container">
      <div className="product-detail">
        <img className="product-image" src={product.image} alt={product.name} />
        <div className="product-info">
          <h1 className="product-name">{product.name}</h1>
          
          {/* Add ProductRating component */}
          <ProductRating productId={product.id} />
          
          <div className="product-price">${product.price.toFixed(2)}</div>
          <div className="product-quantity">In Stock: {product.quantity}</div>
          <p className="product-description">{product.description}</p>
          <div className="product-actions">
            <AddToWishlist productId={product.id} />
            <button className="add-to-cart-button" onClick={handleAddToCart}>
              Add to Cart
            </button>
            <button className="back-to-products" onClick={() => navigate('/products')}>
              Back to Products
            </button>
          </div>

          {feedback && (
            <div className={`product-feedback product-${feedback.type}`}>{feedback.message}</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductDetail