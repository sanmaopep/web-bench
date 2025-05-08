import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema({
  username: String,
  status: {
    type: String,
    enum: ['Pending payment', 'Finished', 'Failed', 'Refund Reviewing', 'Refund Passed'],
    default: 'Pending payment',
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
      name: String,
      price: Number,
      image: String,
      quantity: Number,
    },
  ],
  totalPrice: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

const Order: mongoose.Model<{
  username?: string
  status?: string
  items?: Array<{
    productId: mongoose.Types.ObjectId
    name: string
    price: number
    image: string
    quantity: number
  }>
  totalPrice?: number
  createdAt?: Date
}> = mongoose.models.Order || mongoose.model('Order', orderSchema)

export default Order