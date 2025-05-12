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
