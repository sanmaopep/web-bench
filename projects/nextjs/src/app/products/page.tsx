'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import './products.css'

interface Product {
  id: number
  name: string
  price: number
  image: string
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([])
  const router = useRouter()

  useEffect(() => {
    fetch('/api/products')
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setProducts(data.products)
        }
      })
  }, [])

  const handleProductClick = (productId: number) => {
    router.push(`/products/${productId}`)
  }

  return (
    <div className="product-list">
      {products.map((product) => (
        <div
          className="product-card"
          id={`product_card_${product.id}`}
          key={product.id}
          onClick={() => handleProductClick(product.id)}
        >
          <img className="product-image" src={product.image} alt={product.name} />
          <div className="product-name">{product.name}</div>
          <div className="product-price">${product.price.toFixed(2)}</div>
        </div>
      ))}
    </div>
  )
}
