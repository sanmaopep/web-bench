import { getCurrentUser } from '@/actions/auth'
import './home.css'

export default async function Home() {
  const user = await getCurrentUser()

  return (
    <div className="home-container">
      <h1>🛍️🛍️🛍️ Welcome to Shopping Mart !</h1>
      {user && <h1>Hello {user.username}!</h1>}

      <div className="home-buttons">
        {!user && (
          <a href="/login" className="login-link">
            <button>Login</button>
          </a>
        )}

        <a href="/products" className="home-go-products-link">
          <button>Browse Products</button>
        </a>

        {user && (
          <a href="/wishlist" className="home-go-wish-list">
            <button>My Wishlist</button>
          </a>
        )}

        {user && user.role === 'admin' && (
          <>
            <a href="/admin/products" className="home-go-product-portal-link">
              <button>Product Portal</button>
            </a>
            <a href="/admin/users" className="home-go-user-portal-link">
              <button>User Portal</button>
            </a>
            <a href="/admin/orders" className="home-go-order-portal-link">
              <button>Order Portal</button>
            </a>
          </>
        )}
      </div>
    </div>
  )
}