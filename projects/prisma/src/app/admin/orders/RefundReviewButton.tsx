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
import './orders.css'

export default function RefundReviewButton({ orderId }: { orderId: number }) {
  const [isProcessing, setIsProcessing] = useState(false)
  const router = useRouter()

  const handlePassRefund = async () => {
    setIsProcessing(true)

    try {
      const response = await fetch(`/api/orders/${orderId}/refund/approve`, {
        method: 'POST',
      })

      if (response.ok) {
        router.refresh()
      } else {
        alert('Failed to approve refund')
      }
    } catch (error) {
      console.error('Error approving refund:', error)
      alert('Failed to approve refund')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <button
      className="pass-refund-review-button"
      onClick={handlePassRefund}
      disabled={isProcessing}
    >
      {isProcessing ? 'Processing...' : 'Approve Refund'}
    </button>
  )
}
