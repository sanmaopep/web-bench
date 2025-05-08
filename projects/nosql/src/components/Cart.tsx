'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import './cart.css'

interface CartItem {
  _id: string
  name: string
  price: number
  image: string
  quantity: number
}

export default function Cart() {
  const [items, setItems] = useState<CartItem[]>([])
  const [showPopover, setShowPopover] = useState(false)
  const router = useRouter()

  const fetchCart = async () => {
    const res = await fetch('/api/cart')
    if (res.ok) {
      const data = await res.json()
      setItems(data.items)
    }
  }

  useEffect(() => {
    fetchCart()
    window.addEventListener('cartUpdated', fetchCart)
    window.addEventListener('refreshAuth', fetchCart)
    return () => {
      window.removeEventListener('refreshAuth', fetchCart)
      window.removeEventListener('cartUpdated', fetchCart)
    }
  }, [])

  const removeItem = async (productId: string) => {
    await fetch('/api/cart', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ productId }),
    })
    fetchCart()
  }

  const placeOrder = async () => {
    const res = await fetch('/api/orders', {
      method: 'POST',
    })
    if (res.ok) {
      const { orderId } = await res.json()
      window.dispatchEvent(new Event('cartUpdated'))
      setShowPopover(false)
      router.push(`/order/${orderId}`)
    }
  }

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="cart-container">
      <button className="cart-button" onClick={() => setShowPopover(!showPopover)}>
        🛒 {totalItems}
      </button>

      {showPopover && (
        <div className="cart-popover">
          {items.length === 0 ? (
            <div className="cart-empty">Cart is empty</div>
          ) : (
            <>
              {items.map((item) => (
                <div key={item._id} className="cart-item" id={`cart_item_${item._id}`}>
                  <Link href={`/products/${item._id}`}>
                    <img src={item.image} alt={item.name} className="cart-item-image" />
                    <div className="cart-item-name">{item.name}</div>
                  </Link>
                  <div className="cart-item-price">${item.price}</div>
                  <div className="cart-item-quantity">{item.quantity}</div>
                  <button className="cart-item-remove" onClick={() => removeItem(item._id)}>
                    ✕
                  </button>
                </div>
              ))}
              <div className="cart-total">
                Total: ${items.reduce((sum, item) => sum + item.price * item.quantity, 0)}
              </div>
              <button className="place-order-in-cart" onClick={placeOrder}>
                Place Order
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}
