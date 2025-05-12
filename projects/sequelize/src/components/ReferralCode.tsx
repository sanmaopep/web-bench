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
import './referralCode.css'

interface ReferralCodeProps {
  code: string
}

export default function ReferralCode({ code }: ReferralCodeProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="referral-code-container">
      <h3>Your Referral Code</h3>
      <div className="referral-code-box">
        <span className="referral-code">{code}</span>
        <button 
          className="copy-referral-code" 
          onClick={handleCopy}
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <div className="referral-info">
        <p>When a new user registers through your referral code, you will earn $888, and an additional $1888 when they pay for their first order.</p>
      </div>
    </div>
  )
}