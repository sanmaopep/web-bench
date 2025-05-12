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

export default function PayOrderButton({ orderId }: { orderId: string }) {
  const [isPaying, setIsPaying] = useState(false)
  const router = useRouter()

  const handlePay = async () => {
    setIsPaying(true)
    try {
      await fetch(`/api/orders/${orderId}/pay`, {
        method: 'POST',
      })
    } catch (error) {
      console.error('Payment failed:', error)
    } finally {
      router.refresh()
    }

    setIsPaying(false)
  }

  return (
    <button className="pay-my-order" onClick={handlePay} disabled={isPaying}>
      {isPaying ? 'Processing...' : 'Pay Now'}
    </button>
  )
}
