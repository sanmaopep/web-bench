import '@/model'
import { sequelize } from '@/libs/db'
import { initUsers } from '@/model/user'

export async function register() {
  await sequelize.sync()
  await initUsers()
}
