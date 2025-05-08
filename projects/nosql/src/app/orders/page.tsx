import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getCurrentUser } from '@/actions/auth'
import Order from '@/model/order'
import './style.css'

export default async function OrdersPage() {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    redirect('/login')
  }

  const orders = await Order.find({ username: currentUser.username }).sort({ createdAt: -1 })

  return (
    <div className="orders-page">
      <h1>My Orders</h1>
      <div className="orders-list">
        {orders.map((order) => (
          <Link href={`/order/${String(order._id)}`} key={String(String(order._id))}>
            <div className="order-card" id={`my_order_${String(order._id)}`}>
              <div className="order-card-header">
                <span className="order-id">Order ID: {String(order._id)}</span>
                <span className="order-status">{order.status}</span>
              </div>
              <div className="order-total">Total: ${order.totalPrice}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
