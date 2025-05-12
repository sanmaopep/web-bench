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

'use server'

import db, { runTransaction } from '@/libs/db'

export async function creditReferrer(referralCode: string, amount: number) {
  return new Promise<void>((resolve, reject) => {
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

export async function creditReferrerForFirstPayment(
  currentUserName: string,
  amount: number = 1888
) {
  const hasPurchased = await new Promise<boolean>((resolve, reject) => {
    db.get(
      'SELECT has_first_purchase from users WHERE username = ?',
      [currentUserName],
      (err, row: any) => {
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
