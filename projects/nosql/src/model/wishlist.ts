import mongoose from 'mongoose'

const wishlistSchema = new mongoose.Schema({
  username: String,
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
})

wishlistSchema.index({ username: 1, productId: 1 }, { unique: true })

const Wishlist: mongoose.Model<{
  username?: string
  productId?: string
}> = mongoose.models.Wishlist || mongoose.model('Wishlist', wishlistSchema)

export default Wishlist
