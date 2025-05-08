import React, { useState, useEffect } from 'react'
import './ReferralCode.css'

interface ReferralHistory {
  username: string
  reward: number
  date: string
  type: 'registration' | 'order'
}

interface ReferralCodeProps {
  username: string
}

const ReferralCode: React.FC<ReferralCodeProps> = ({ username }) => {
  const [referralCode, setReferralCode] = useState<string>('')
  const [referralHistory, setReferralHistory] = useState<ReferralHistory[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [showCopyMessage, setShowCopyMessage] = useState<boolean>(false)

  useEffect(() => {
    const fetchReferralData = async () => {
      try {
        const response = await fetch(`/api/users/${username}/referral`)
        const data = await response.json()

        if (data.success) {
          setReferralCode(data.referralCode)
          setReferralHistory(data.history || [])
        }
      } catch (error) {
        console.error('Error fetching referral data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchReferralData()
  }, [username])

  const handleCopyReferralCode = () => {
    navigator.clipboard
      .writeText(referralCode)
      .then(() => {
        setShowCopyMessage(true)
        setTimeout(() => setShowCopyMessage(false), 2000)
      })
      .catch((err) => console.error('Failed to copy text: ', err))
  }

  if (loading) {
    return <div className="referral-code-container">Loading referral code...</div>
  }

  return (
    <div className="referral-code-container">
      <h3 className="referral-code-title">Your Referral Code</h3>
      <div className="referral-code" onClick={handleCopyReferralCode}>
        {referralCode}
      </div>

      <div className="referral-rules">
        When a new user registers through your referral code, you will earn $888, and an additional
        $1888 when they pay for their first order.
      </div>

      <div className="referral-history">
        <h4 className="referral-history-title">Referral History</h4>
        {referralHistory.length === 0 ? (
          <p className="referral-history-empty">No referrals yet.</p>
        ) : (
          <ul className="referral-history-list">
            {referralHistory.map((item, index) => (
              <li key={index} className="referral-history-item">
                <div>
                  <span className="referral-username">{item.username}</span>
                  <div className="referral-date">{new Date(item.date).toLocaleDateString()}</div>
                </div>
                <span className="referral-reward">
                  +${item.reward} ({item.type === 'registration' ? 'Registration' : 'First Order'})
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {showCopyMessage && (
        <div className="copy-success-message">Referral code copied to clipboard!</div>
      )}
    </div>
  )
}

export default ReferralCode
