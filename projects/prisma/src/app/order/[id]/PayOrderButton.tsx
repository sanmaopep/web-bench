'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import './pay-order-button.css'

interface PayOrderButtonProps {
  orderId: number
  totalPrice: number
  onRefresh: () => void
}

export default function PayOrderButton({ orderId, totalPrice, onRefresh }: PayOrderButtonProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handlePayment = async () => {
    setIsProcessing(true)
    setError(null)

    try {
      const response = await fetch(`/api/orders/${orderId}/pay`, {
        method: 'POST',
      })

      const data = await response.json()

      if (!data.success) {
        setError(data.message || 'Payment failed')
      }
    } catch (error) {
      console.error('Payment error:', error)
      setError('Payment processing failed')
    } finally {
      setIsProcessing(false)
      onRefresh()
    }
  }

  return (
    <div className="payment-section">
      <button className="pay-my-order" onClick={handlePayment} disabled={isProcessing}>
        {isProcessing ? 'Processing...' : `Pay ${totalPrice} Coins`}
      </button>
      {error && <p className="payment-error">{error}</p>}
    </div>
  )
}
