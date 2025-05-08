import { getCurrentUser } from '@/actions/auth'

export default async function Home() {
  const user = await getCurrentUser()

  return (
    <div>
      <h1>🛍️🛍️🛍️ Welcome to Shopping Mart !</h1>
      <h1>Hello {user?.username || 'Guest'}!</h1>
      <a href="/products">
        <button className="home-go-products-link">View Products</button>
      </a>
      {user && (
        <a href="/wishlist">
          <button className="home-go-wish-list">My Wishlist</button>
        </a>
      )}
      {user?.role === 'admin' && (
        <>
          <a href="/admin/products">
            <button className="home-go-product-portal-link">Product Portal</button>
          </a>
          <a href="/admin/users">
            <button className="home-go-user-portal-link">User Portal</button>
          </a>
          <a href="/admin/orders">
            <button className="home-go-order-portal-link">Order Portal</button>
          </a>
        </>
      )}
    </div>
  )
}
