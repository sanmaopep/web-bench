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

const { PrismaClient } = require('../generated')

// Function to generate random referral code
function generateReferralCode(length = 8) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return result
}

const prisma = new PrismaClient()

/**
 * Seeding will be executed before the server starts
 */
async function main() {
  await prisma.user.deleteMany()
  await prisma.user.create({
    data: {
      username: 'admin',
      password: '123456',
      role: 'admin',
      coin: 0,
      referralCode: generateReferralCode(8),
      isFirstPurchase: true,
    },
  })
  await prisma.user.create({
    data: {
      username: 'user',
      password: '123456',
      role: 'user',
      coin: 1000,
      referralCode: generateReferralCode(8),
      isFirstPurchase: true,
    },
  })

  console.log('✔ Seeding completed \n\n')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
