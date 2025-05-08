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