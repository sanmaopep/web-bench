const db = require('../../libs/db')
const { runTransaction } = require('../../libs/db-utils')

async function checkReferrerExists(referrerCode) {
  return new Promise((resolve, reject) => {
    db.get('SELECT username FROM users WHERE referral_code =?', [referrerCode], (err, row) => {
      if (err) {
        reject(err)
      }
      resolve(!!row?.username)
    })
  })
}

function generateReferralCode() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  for (let i = 0; i < 8; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return result
}

async function creditReferrer(referralCode, amount = 888) {
  return new Promise((resolve, reject) => {
    db.run(
      'UPDATE users SET coin = coin + ? WHERE referral_code = ?',
      [amount, referralCode],
      (err) => {
        if (err) reject(err)
        else resolve()
      }
    )
  })
}

async function creditReferrerForFirstPayment(currentUserName, amount = 1888) {
  const hasPurchased = await new Promise((resolve, reject) => {
    db.get(
      'SELECT has_first_purchase from users WHERE username = ?',
      [currentUserName],
      (err, row) => {
        if (err) {
          reject(err)
        }
        resolve(!!row?.has_first_purchase)
      }
    )
  })

  if (!hasPurchased) {
    await runTransaction([
      {
        sql: 'UPDATE users SET has_first_purchase = 1 WHERE username = ?',
        deps: [currentUserName],
      },
      {
        sql: 'UPDATE users SET coin = coin + ? WHERE referral_code = (SELECT referrer_referral_code FROM users WHERE username =?)',
        deps: [amount, currentUserName],
      },
    ])
  }
}

module.exports = {
  checkReferrerExists,
  generateReferralCode,
  creditReferrer,
  creditReferrerForFirstPayment,
}
