const { PrismaClient } = require('../generated')

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
    },
  })
  await prisma.user.create({
    data: {
      username: 'user',
      password: '123456',
      role: 'user',
      coin: 1000,
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
