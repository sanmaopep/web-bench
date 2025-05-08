import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import { useAuth } from '../context/auth'
import './order-detail.css'

interface OrderItem {
  productId: number
  name: string
  price: number
  image: string
  quantity: number
}

interface Order {
  id: number
  date: string
  status: string
  totalPrice: number
  items: OrderItem[]
}

const OrderDetail = () => {
  const { order_id } = useParams<{ order_id: string }>()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [paymentStatus, setPaymentStatus] = useState<{
    message: string
    type: 'success' | 'error'
  } | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const navigate = useNavigate()
  const { isAuthenticated, user, login } = useAuth()

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    fetchOrderDetail()
  }, [isAuthenticated, navigate, order_id])

  const fetchOrderDetail = async () => {
    try {
      const response = await fetch(`/api/orders/${order_id}`)
      const data = await response.json()

      if (data.success) {
        setOrder(data.order)
      } else {
        setError('Failed to load order details')
      }
    } catch (err) {
      setError('Error connecting to server')
    } finally {
      setLoading(false)
    }
  }

  const handlePayOrder = async () => {
    if (!order || !user) return

    setIsProcessing(true)
    setPaymentStatus(null)

    try {
      const response = await fetch(`/api/orders/${order.id}/pay`, {
        method: 'POST',
      })

      const data = await response.json()

      if (data.success) {
        setPaymentStatus({
          message: 'Payment successful! Order has been processed.',
          type: 'success',
        })

        // Update order status
        setOrder((prev) => {
          if (!prev) return null
          return { ...prev, status: 'Finished' }
        })

        // Refresh user data to update coin balance
        await login()
      } else {
        setPaymentStatus({
          message: data.message || 'Payment failed.',
          type: 'error',
        })

        // Update order status if it failed
        if (data.status === 'Failed') {
          setOrder((prev) => {
            if (!prev) return null
            return { ...prev, status: 'Failed' }
          })
        }
      }
    } catch (err) {
      setPaymentStatus({
        message: 'Error processing payment.',
        type: 'error',
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleRefundOrder = async () => {
    if (!order) return

    setIsProcessing(true)
    setPaymentStatus(null)

    try {
      const response = await fetch(`/api/orders/${order.id}/refund`, {
        method: 'POST',
      })

      const data = await response.json()

      if (data.success) {
        setPaymentStatus({
          message: 'Refund request submitted! It is under review.',
          type: 'success',
        })

        // Update order status
        setOrder((prev) => {
          if (!prev) return null
          return { ...prev, status: 'Refund Reviewing' }
        })
      } else {
        setPaymentStatus({
          message: data.message || 'Refund request failed.',
          type: 'error',
        })
      }
    } catch (err) {
      setPaymentStatus({
        message: 'Error requesting refund.',
        type: 'error',
      })
    } finally {
      setIsProcessing(false)
    }
  }

  if (loading) return <div className="order-detail-loading">Loading order details...</div>
  if (error) return <div className="order-detail-error">{error}</div>
  if (!order) return <div className="order-detail-error">Order not found</div>

  const showPayButton = order.status === 'Pending payment'
  const showRefundButton = order.status === 'Finished'

  return (
    <div className="order-detail-container">
      <h1 className="order-detail-title">Order Details</h1>

      <div className="order-info">
        <div className="order-id-date">
          <div className="order-number">Order #{order.id}</div>
          <div className="order-date">{new Date(order.date).toLocaleDateString()}</div>
        </div>
        <div className="order-status-price">
          <div className={`order-status status-${order.status.toLowerCase().replace(' ', '-')}`}>
            Status: {order.status}
          </div>
          <div className="order-price">Total: ${order.totalPrice.toFixed(2)}</div>
        </div>
      </div>

      {paymentStatus && (
        <div className={`payment-${paymentStatus.type}`}>{paymentStatus.message}</div>
      )}

      <div className="order-actions">
        {showPayButton && (
          <button className="pay-my-order" onClick={handlePayOrder} disabled={isProcessing}>
            {isProcessing ? 'Processing...' : 'Pay Now'}
          </button>
        )}
        
        {showRefundButton && (
          <button className="refund-button" onClick={handleRefundOrder} disabled={isProcessing}>
            {isProcessing ? 'Processing...' : 'Request Refund'}
          </button>
        )}
      </div>

      <table className="order-items-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Product</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((item) => (
            <tr key={item.productId} id={`product_in_order_${item.productId}`}>
              <td>
                <img src={item.image} alt={item.name} className="product-image" />
              </td>
              <td className="product-name">{item.name}</td>
              <td className="product-price">${item.price.toFixed(2)}</td>
              <td className="product-quantity">{item.quantity}</td>
              <td className="product-total">${(item.price * item.quantity).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button className="back-to-orders" onClick={() => navigate('/orders')}>
        Back to Orders
      </button>
    </div>
  )
}

export default OrderDetail