'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import './products-admin.css'

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
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    async function checkUser() {
      try {
        const response = await fetch('/api/auth')
        if (response.ok) {
          const userData = await response.json()
          if (userData.role !== 'admin') {
            router.push('/login')
          } else {
            fetchProducts()
          }
        } else {
          router.push('/login')
        }
      } catch (error) {
        router.push('/login')
      }
    }

    async function fetchProducts() {
      try {
        const response = await fetch('/api/products')
        const data = await response.json()
        if (data.success) {
          setProducts(data.products)
        } else {
          setError('Failed to load products')
        }
      } catch (error) {
        setError('Failed to load products')
      } finally {
        setLoading(false)
      }
    }

    checkUser()
  }, [router])

  if (loading) return <div className="admin-loading">Loading...</div>
  if (error) return <div className="admin-error">{error}</div>

  return (
    <div className="admin-products-container">
      <h1>Admin Product Management</h1>
      
      <div className="admin-table-container">
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
                    className="admin-product-thumbnail" 
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
    </div>
  )
}