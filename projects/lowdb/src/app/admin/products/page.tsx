'use client'

import { useEffect, useState } from 'react'

interface Product {
  id: string
  name: string
  price: number
  image: string
  description: string
  quantity: number
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    const fetchProducts = async () => {
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

  return (
    <div className="admin-products">
      <div className="admin-header">
        <h1>Manage Products</h1>
      </div>
      
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Image</th>
            <th>Name</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id} id={`admin_product_${product.id}`}>
              <td>{product.id}</td>
              <td>
                <img 
                  src={product.image} 
                  alt={product.name} 
                  style={{ width: '50px', height: '50px', objectFit: 'cover' }} 
                />
              </td>
              <td>{product.name}</td>
              <td>${product.price}</td>
              <td>{product.quantity}</td>
              <td>{product.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}