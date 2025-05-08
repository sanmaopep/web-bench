'use client'

import { useState } from 'react'
import './refund-button.css'

interface RefundButtonProps {
  orderId: number
  onRefresh: () => void
}

export default function RefundButton({ orderId, onRefresh }: RefundButtonProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleRefund = async () => {
    setIsProcessing(true)
    setError(null)

    try {
      const response = await fetch(`/api/orders/${orderId}/refund`, {
        method: 'POST',
      })

      const data = await response.json()

      if (!data.success) {
        setError(data.message || 'Refund request failed')
      }
    } catch (error) {
      console.error('Refund error:', error)
      setError('Refund processing failed')
    } finally {
      setIsProcessing(false)
      onRefresh()
    }
  }

  return (
    <div className="refund-section">
      <button className="refund-button" onClick={handleRefund} disabled={isProcessing}>
        {isProcessing ? 'Processing...' : 'Request Refund'}
      </button>
      {error && <p className="refund-error">{error}</p>}
    </div>
  )
}
