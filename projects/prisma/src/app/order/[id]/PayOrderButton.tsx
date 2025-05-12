// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//     http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

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
