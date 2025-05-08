import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  role: String,
  coin: Number,
})

userSchema.index({ username: 1 }, { unique: true })

const User: mongoose.Model<{
  username?: string
  password?: string
  role?: string
  coin?: number
}> = mongoose.models.User || mongoose.model('User', userSchema)

// Initial Users will be init When server registered
export const initUsers = async () => {
  if (!(await User.findOne())) {
    await User.create([
      { username: 'admin', password: '123456', role: 'admin', coin: 0 },
      { username: 'user', password: '123456', role: 'user', coin: 1000 },
    ])
  }
}

export default User
