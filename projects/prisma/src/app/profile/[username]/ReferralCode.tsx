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
import './referral-code.css'

export default function ReferralCode({ referralCode }: { referralCode: string }) {
  const [isCopied, setIsCopied] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralCode);
    setIsCopied(true);
    
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  }

  return (
    <div className="referral-section">
      <h3 className="referral-title">Invite Friends & Earn Rewards</h3>
      
      <div className="referral-code-container">
        <span className="referral-code-label">Your Referral Code:</span>
        <div className="referral-code">{referralCode}</div>
        <button 
          className="copy-referral-code" 
          onClick={copyToClipboard}
        >
          {isCopied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      
      <p className="referral-rules">
        When a new user registers through your referral code, you will earn $888, and an additional $1888 when they pay for their first order.
      </p>
    </div>
  )
}