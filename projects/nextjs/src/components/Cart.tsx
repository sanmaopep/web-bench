// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//     http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

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
