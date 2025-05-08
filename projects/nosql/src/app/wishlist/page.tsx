import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/actions/auth'
import Wishlist from '@/model/wishlist'
import Product from '@/model/product'
import RemoveFromWishlistButton from './RemoveFromWishlistButton'
import './style.css'

export default async function WishlistPage() {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    redirect('/login')
  }

  const wishlistItems = await Wishlist.find({ username: currentUser.username })
  const products = await Promise.all(wishlistItems.map((item) => Product.findById(item.productId)))

  if (products.length === 0) {
    return (
      <div className="wishlist-container">
        <h1 className="wishlist-title">My Wishlist</h1>
        <div className="empty-wishlist">Your wishlist is empty</div>
      </div>
    )
  }

  return (
    <div className="wishlist-container">
      <h1 className="wishlist-title">My Wishlist</h1>
      {products.map((product) => (
        <div
          key={String(product._id)}
          className="wishlist-item"
          id={`wishlist_item_${product._id}`}
        >
          <img className="wishlist-image" src={product.image} alt={product.name} />
          <div className="wishlist-info">
            <div className="wishlist-name">{product.name}</div>
            <div className="wishlist-price">${product.price}</div>
          </div>
          <RemoveFromWishlistButton productId={String(product._id)} />
        </div>
      ))}
    </div>
  )
}
