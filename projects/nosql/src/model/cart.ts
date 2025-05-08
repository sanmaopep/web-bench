import mongoose from 'mongoose'

const cartSchema = new mongoose.Schema({
  username: String,
  items: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    quantity: Number
  }]
})

const Cart: mongoose.Model<{
  username?: string,
  items?: Array<{
    productId: string,
    quantity: number
  }>
}> = mongoose.models.Cart || mongoose.model('Cart', cartSchema)

export default Cart