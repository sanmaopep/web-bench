import { getCurrentUser } from '@/actions/auth'
import Product from '@/model/product'
import Order from '@/model/order'
import Comment from '@/model/comment'
import AddToWishlistButton from './AddToWishlistButton'
import AddToCartButton from './AddToCartButton'
import CommentForm from './CommentForm'
import ProductComments from './ProductComments'
import './styles.css'

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = await Product.findById(id)
  const currentUser = await getCurrentUser()

  if (!product) {
    return <div>Product Not Found</div>
  }

  let canComment = false
  if (currentUser) {
    const hasFinishedOrder = await Order.findOne({
      username: currentUser.username,
      status: 'Finished',
      'items.productId': product._id
    })
    
    const hasCommented = await Comment.findOne({
      username: currentUser.username,
      productId: product._id
    })

    canComment = hasFinishedOrder && !hasCommented
  }

  return (
    <div className="product-detail">
      <img className="product-image" src={product.image} alt={product.name} />
      <div className="product-info">
        <h1 className="product-name">{product.name}</h1>
        <p className="product-price">${product.price}</p>
        <p className="product-quantity">Quantity: {product.quantity}</p>
        <p className="product-description">{product.description}</p>
        <AddToWishlistButton productId={String(product._id)} />
        <AddToCartButton productId={String(product._id)} />
      </div>
      
      <div className="product-comments-section">
        <ProductComments productId={String(product._id)} />
        {canComment && <CommentForm productId={String(product._id)} />}
      </div>
    </div>
  )
}