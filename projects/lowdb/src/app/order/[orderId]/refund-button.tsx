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
import './refund-button.css'

interface RefundButtonProps {
  orderId: string
  onSuccess: () => void
}

export default function RefundButton({ orderId, onSuccess }: RefundButtonProps) {
  const [loading, setLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleRefundRequest = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/orders/${orderId}/refund`, {
        method: 'POST',
      })

      const data = await response.json()

      if (data.success) {
        alert('Refund request submitted successfully!')
        setIsSubmitted(true)
        onSuccess()
      } else {
        alert(`Refund request failed: ${data.error}`)
      }
    } catch (error) {
      alert('An error occurred during the refund request')
      console.error('Refund request error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (isSubmitted) {
    return null
  }

  return (
    <button className="refund-button" onClick={handleRefundRequest} disabled={loading}>
      {loading ? 'Processing...' : 'Request Refund'}
    </button>
  )
}
