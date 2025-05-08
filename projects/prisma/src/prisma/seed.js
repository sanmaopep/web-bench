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
