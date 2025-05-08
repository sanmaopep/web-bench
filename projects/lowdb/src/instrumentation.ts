const defaultData: DatabaseData = {
  users: [
    {
      username: 'admin',
      password: '123456',
      role: 'admin',
      coin: 0,
    },
    {
      username: 'user',
      password: '123456',
      role: 'user',
      coin: 1000,
    },
  ],
  products: [],
  wishlist: [],
  orders: [],
  cart: [],
  comments: [],
  referrals: [],
}

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { JSONFilePreset } = await import('lowdb/node')
    global.db = await JSONFilePreset(
      process.env.DB_PATH!,
      defaultData
    )
  }
}