'use client'

import { useEffect, useState } from 'react'
import './orders-admin.css'

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

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/orders')
      const data = await response.json()

      if (data.success) {
        setOrders(data.orders)
      } else {
        alert('Failed to fetch orders: ' + (data.error || 'Unknown error'))
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
      alert('An error occurred while fetching orders')
    } finally {
      setLoading(false)
    }
  }

  const handlePassRefundReview = async (orderId: string) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}/approve-refund`, {
        method: 'POST',
      })

      const data = await response.json()

      if (data.success) {
        fetchOrders() // Refresh the orders list
      } else {
        alert(`Failed to approve refund: ${data.error}`)
      }
    } catch (error) {
      console.error('Error approving refund:', error)
      alert('An error occurred while approving the refund')
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  }

  if (loading) {
    return <div className="admin-orders-loading">Loading orders...</div>
  }

  return (
    <div className="admin-orders-container">
      <div className="admin-orders-header">
        <h1>Manage Orders</h1>
      </div>

      {orders.length === 0 ? (
        <div className="admin-orders-empty">No orders found</div>
      ) : (
        <table className="admin-orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Total</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} id={`admin_order_${order.id}`}>
                <td>#{order.id.substring(0, 8)}</td>
                <td>{order.username}</td>
                <td>{formatDate(order.createdAt)}</td>
                <td>${order.totalPrice.toFixed(2)}</td>
                <td>
                  <span
                    className={`status-badge status-${order.status
                      .replace(/\s+/g, '-')
                      .toLowerCase()}`}
                  >
                    {order.status}
                  </span>
                </td>
                <td>
                  {order.status === 'Refund Reviewing' && (
                    <button
                      className="pass-refund-review-button"
                      onClick={() => handlePassRefundReview(order.id)}
                    >
                      Approve Refund
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
