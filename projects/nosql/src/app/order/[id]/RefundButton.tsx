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

import { useRouter } from 'next/navigation'

export default function RefundButton({ orderId }: { orderId: string }) {
  const router = useRouter()

  const handleRefund = async () => {
    const response = await fetch(`/api/orders/${orderId}/refund`, {
      method: 'POST'
    })

    if (response.ok) {
      router.refresh()
    }
  }

  return (
    <button className="refund-button" onClick={handleRefund}>
      Request Refund
    </button>
  )
}