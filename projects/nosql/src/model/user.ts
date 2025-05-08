import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  role: String,
  coin: Number,
  referralCode: String,
  referralPending: [String]
})

userSchema.index({ username: 1 }, { unique: true })
userSchema.index({ referralCode: 1 }, { unique: true, sparse: true })

const User: mongoose.Model<{
  username?: string
  password?: string
  role?: string
  coin?: number
  referralCode?: string
  referralPending?: string[]
}> = mongoose.models.User || mongoose.model('User', userSchema)

export const initUsers = async () => {
  if (!(await User.findOne())) {
    await User.create([
      { username: 'admin', password: '123456', role: 'admin', coin: 0 },
      { username: 'user', password: '123456', role: 'user', coin: 1000 },
    ])
  }
}

export default User