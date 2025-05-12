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
import { rechargeCoin } from '@/actions/recharge'
import { useRouter } from 'next/navigation'

export default function RechargeButton() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleRecharge = async () => {
    setLoading(true)
    try {
      const result = await rechargeCoin()
      if (result.success) {
        router.refresh()
      } else {
        alert('Failed to recharge: ' + result.error)
      }
    } catch (error) {
      alert('An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button 
      className="recharge-button" 
      onClick={handleRecharge}
      disabled={loading}
    >
      {loading ? 'Processing...' : 'Recharge 1000 Coins'}
    </button>
  )
}