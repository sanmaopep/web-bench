import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  image: String,
  description: String,
  quantity: Number,
})

const Product: mongoose.Model<{
  name?: string
  price?: number
  image?: string
  description?: string
  quantity?: number
}> = mongoose.models.Product || mongoose.model('Product', productSchema)

export default Product