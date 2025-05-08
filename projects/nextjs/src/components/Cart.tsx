'use client'

import { useState } from 'react'
import './Cart.css'
import { useCart } from '@/context/cart'
import { useRouter } from 'next/navigation'

export default function Cart() {
  const [showPopover, setShowPopover] = useState(false)
  const { cartItems, removeFromCart, clearCart } = useCart()
  const router = useRouter()

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  const handlePlaceOrder = async () => {
    const response = await fetch('/api/orders', {
      method: 'POST',
    })
    const data = await response.json()
    if (data.success) {
      clearCart()
      router.push(`/order/${data.orderId}`)
    }
  }

  return (
    <div className="cart-container">
      <button className="cart-button" onClick={() => setShowPopover(!showPopover)}>
        🛒 {totalItems}
      </button>
      {showPopover && (
        <div className="cart-popover">
          {cartItems.map((item) => (
            <div key={item.product_id} id={`cart_item_${item.product_id}`} className="cart-item">
              <img src={item.image} alt={item.name} className="cart-item-image" />
              <div className="cart-item-details">
                <div className="cart-item-name">{item.name}</div>
                <div className="cart-item-price">${item.price.toFixed(2)}</div>
                <div className="cart-item-quantity">Quantity: {item.quantity}</div>
              </div>
              <button className="cart-item-remove" onClick={() => removeFromCart(item.product_id)}>
                Remove
              </button>
            </div>
          ))}
          <div className="cart-total">
            Total: $
            {cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}
          </div>
          {cartItems.length > 0 && (
            <button className="place-order-in-cart" onClick={handlePlaceOrder}>
              Place Order
            </button>
          )}
        </div>
      )}
    </div>
  )
}
