import { getLoggedInUser } from '@/actions/auth'

export default async function Home() {
  const user = await getLoggedInUser()

  return (
    <div>
      {user && <h1>Hello {user.username}!</h1>}
      <h1>🛍️🛍️🛍️ Welcome to Shopping Mart !</h1>
      <div className="home-buttons">
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
              <button>Product Admin Portal</button>
            </a>
            <a href="/admin/users" className="home-go-user-portal-link">
              <button>User Admin Portal</button>
            </a>
            <a href="/admin/orders" className="home-go-order-portal-link">
              <button>Order Admin Portal</button>
            </a>
          </>
        )}
      </div>
    </div>
  )
}