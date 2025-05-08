import { getCurrentUser } from '@/actions/auth'
import Link from 'next/link'
import './home.css'

export default async function HomePage() {
  const user = await getCurrentUser()

  return (
    <div className="home-container">
      {user && <h1 className="home-greeting">Hello {user.username}!</h1>}
      <h1 className="home-title">🛍️🛍️🛍️ Welcome to Shopping Mart !</h1>
      
      <div className="home-links">
        <Link href="/products" className="home-go-products-link">
          <button>View All Products</button>
        </Link>
        
        {user?.username && (
          <Link href="/wishlist" className="home-go-wish-list">
            <button>My Wishlist</button>
          </Link>
        )}
        
        {user?.role === 'admin' && (
          <>
            <Link href="/admin/products" className="home-go-product-portal-link">
              <button>Product Management</button>
            </Link>
            <Link href="/admin/users" className="home-go-user-portal-link">
              <button>User Management</button>
            </Link>
            <Link href="/admin/orders" className="home-go-order-portal-link">
              <button>Order Management</button>
            </Link>
          </>
        )}
      </div>
    </div>
  )
}