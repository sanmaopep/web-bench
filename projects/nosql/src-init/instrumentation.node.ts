import mongoose from 'mongoose'
import { initUsers } from './model/user'

export async function register() {
  // 1. Connect to MongoDB
  await mongoose.connect(process.env.MONGO_URI!)

  // 2. init two users
  await initUsers()
}
