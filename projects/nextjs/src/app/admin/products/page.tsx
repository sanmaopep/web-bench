'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import '../admin.css'

interface Product {
  id: number
  name: string
  price: number
  image: string
  description: string
  quantity: number
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const router = useRouter()

  useEffect(() => {
    fetch('/api/auth')
      .then((response) => response.json())
      .then((data) => {
        if (data.success === false || data.role !== 'admin') {
          router.push('/login')
        } else {
          fetchProducts()
        }
      })
  }, [router])

  const fetchProducts = () => {
    fetch('/api/products')
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setProducts(data.products)
        }
      })
  }

  return (
    <div className="admin-container">
      <h1>Admin Product Portal</h1>
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Price</th>
            <th>Image</th>
            <th>Description</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} id={`admin_product_${product.id}`}>
              <td>{product.id}</td>
              <td>{product.name}</td>
              <td>${product.price.toFixed(2)}</td>
              <td>
                <img src={product.image} alt={product.name} className="admin-product-image" />
              </td>
              <td>{product.description}</td>
              <td>{product.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
