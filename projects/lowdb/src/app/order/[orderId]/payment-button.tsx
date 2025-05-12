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
import './payment-button.css'

interface PaymentButtonProps {
  orderId: string
  onSuccess: () => void
}

export default function PaymentButton({ orderId, onSuccess }: PaymentButtonProps) {
  const [loading, setLoading] = useState(false)

  const handlePayment = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/orders/${orderId}/pay`, {
        method: 'POST'
      })
      
      const data = await response.json()
      
      if (data.success) {
        alert('Payment successful!')
        onSuccess()
      } else {
        alert(`Payment failed: ${data.error}`)
        onSuccess() // Refresh to see updated status
      }
    } catch (error) {
      alert('An error occurred during payment')
      console.error('Payment error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button 
      className="pay-my-order" 
      onClick={handlePayment}
      disabled={loading}
    >
      {loading ? 'Processing...' : 'Pay Now'}
    </button>
  )
}