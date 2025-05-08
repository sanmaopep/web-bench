'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/auth'
import { getUserOrders } from '@/actions/order'
import './orders.css'

interface OrderItem {
  productId: string
  name: string
  price: number
  image: string
  quantity: number
}

interface Order {
  id: string
  username: string
  items: OrderItem[]
  totalPrice: number
  status: string
  createdAt: string
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const { auth } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!auth?.username) {
      router.push('/login')
      return
    }
    
    fetchOrders()
  }, [auth, router])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const result = await getUserOrders()
      if (result.success) {
        setOrders(result.orders)
      } else {
        alert(result.error || 'Failed to load orders')
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  if (loading) {
    return <div className="orders-loading">Loading your orders...</div>
  }

  return (
    <div className="orders-container">
      <h1>My Orders</h1>
      
      {orders.length === 0 ? (
        <div className="orders-empty">
          <p>You haven't placed any orders yet</p>
          <button onClick={() => router.push('/products')} className="browse-products-btn">
            Browse Products
          </button>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map(order => (
            <div 
              className="order-card" 
              id={`my_order_${order.id}`} 
              key={order.id}
              onClick={() => router.push(`/order/${order.id}`)}
            >
              <div className="order-header">
                <div className="order-id">Order #{order.id.substring(0, 8)}</div>
                <div className="order-date">{formatDate(order.createdAt)}</div>
              </div>
              <div className="order-details">
                <div className="order-items-count">
                  {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                </div>
                <div className="order-total-price">${order.totalPrice.toFixed(2)}</div>
              </div>
              <div className="order-status">
                <span className={`status-badge status-${order.status.replace(/\s+/g, '-').toLowerCase()}`}>
                  {order.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}