import mongoose from 'mongoose'

const commentSchema = new mongoose.Schema({
  username: String,
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  text: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
})

commentSchema.index({ username: 1, productId: 1 }, { unique: true })

const Comment: mongoose.Model<{
  username?: string
  productId?: string
  rating?: number
  text?: string
  createdAt?: Date
}> = mongoose.models.Comment || mongoose.model('Comment', commentSchema)

export default Comment