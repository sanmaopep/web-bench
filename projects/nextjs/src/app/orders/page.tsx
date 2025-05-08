'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import './orders.css'

interface Order {
  id: number
  status: string
  total_price: number
  created_at: string
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([])
  const router = useRouter()

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    const response = await fetch('/api/orders')
    const data = await response.json()
    if (data.success) {
      setOrders(data.orders)
    } else {
      router.push('/login')
    }
  }

  return (
    <div className="orders-container">
      <h1>My Orders</h1>
      {orders.map((order) => (
        <div
          key={order.id}
          id={`my_order_${order.id}`}
          className="order-item"
          onClick={() => router.push(`/order/${order.id}`)}
        >
          <div className="order-id">Order #{order.id}</div>
          <div className="order-status">{order.status}</div>
          <div className="order-total-price">${order.total_price.toFixed(2)}</div>
          <div className="order-date">{new Date(order.created_at).toLocaleString()}</div>
        </div>
      ))}
    </div>
  )
}
