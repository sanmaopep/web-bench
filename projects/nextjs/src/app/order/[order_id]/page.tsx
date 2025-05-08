'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import '../order.css'
import { useAuth } from '@/context/auth'

interface OrderItem {
  id: number
  name: string
  price: number
  image: string
  quantity: number
}

interface Order {
  id: number
  status: string
  total_price: number
  created_at: string
  products: OrderItem[]
}

export default function OrderDetail() {
  const [order, setOrder] = useState<Order | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { order_id } = useParams()
  const { auth } = useAuth()

  useEffect(() => {
    fetchOrder()
  }, [order_id])

  const fetchOrder = async () => {
    const response = await fetch(`/api/orders/${order_id}`)
    const data = await response.json()
    if (data.success) {
      setOrder(data.order)
    }
  }

  const handlePayOrder = async () => {
    const response = await fetch(`/api/orders/${order_id}/pay`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    })
    const data = await response.json()
    // fetch latest order info even failed
    await fetchOrder()

    if (!data.success) {
      setError(data.error)
    }
  }

  const handleRefundOrder = async () => {
    const response = await fetch(`/api/orders/${order_id}/refund`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    })
    const data = await response.json()
    if (data.success) {
      await fetchOrder()
    } else {
      setError(data.error)
    }
  }

  if (!order) {
    return <div>Loading...</div>
  }

  return (
    <div className="order-detail-container">
      <h1>Order #{order.id}</h1>
      <div className="order-info">
        <div className="order-status">Status: {order.status}</div>
        <div className="order-date">Date: {new Date(order.created_at).toLocaleString()}</div>
      </div>
      <table className="order-items">
        <thead>
          <tr>
            <th>Product</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {order.products.map((item) => (
            <tr key={item.id} id={`product_in_order_${item.id}`}>
              <td>
                <img src={item.image} alt={item.name} className="product-image" />
                <span className="product-name">{item.name}</span>
              </td>
              <td>${item.price.toFixed(2)}</td>
              <td>{item.quantity}</td>
              <td>${(item.price * item.quantity).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="order-total">Total: ${order.total_price.toFixed(2)}</div>
      {order.status === 'Pending payment' && auth?.username && (
        <button className="pay-my-order" onClick={handlePayOrder}>
          Pay Now
        </button>
      )}
      {order.status === 'Finished' && auth?.username && (
        <button className="refund-button" onClick={handleRefundOrder}>
          Request Refund
        </button>
      )}
      {error && <div className="error-message">{error}</div>}
    </div>
  )
}
