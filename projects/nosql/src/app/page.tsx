import Link from 'next/link'
import { getCurrentUser } from '@/actions/auth'

export default async function HomePage() {
  const user = await getCurrentUser()

  return (
    <div>
      {user ? <h1>Hello {user.username}!</h1> : null}
      <h1>🛍️🛍️🛍️ Welcome to Shopping Mart !</h1>
      <Link href="/products" className="home-go-products-link">
        View Products
      </Link>
      {user?.role === 'admin' && (
        <>
          <Link href="/admin/products" className="home-go-product-portal-link">
            Product Portal
          </Link>
          <Link href="/admin/users" className="home-go-user-portal-link">
            User Portal
          </Link>
          <Link href="/admin/orders" className="home-go-order-portal-link">
            Order Portal
          </Link>
        </>
      )}
      {user && (
        <Link href="/wishlist" className="home-go-wish-list">
          My Wishlist
        </Link>
      )}
    </div>
  )
}