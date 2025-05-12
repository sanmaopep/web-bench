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

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import './cart.css'

interface CartItem {
  id: number
  productId: number
  quantity: number
  product: {
    id: number
    name: string
    price: number
    image: string
  }
}

export default function Cart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [showPopover, setShowPopover] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)
  const popoverRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    fetchCartItems()

    window.addEventListener('refreshCart', fetchCartItems)
    window.addEventListener('refreshAuth', fetchCartItems)

    return () => {
      window.removeEventListener('refreshCart', fetchCartItems)
      window.removeEventListener('refreshAuth', fetchCartItems)
    }
  }, [])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setShowPopover(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const fetchCartItems = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/cart')
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setCartItems(data.items || [])
        }
      }
    } catch (error) {
      console.error('Failed to fetch cart items:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveItem = async (productId: number) => {
    try {
      const response = await fetch('/api/cart', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId }),
      })

      if (response.ok) {
        setCartItems((prevItems) => prevItems.filter((item) => item.productId !== productId))
      }
    } catch (error) {
      console.error('Failed to remove item from cart:', error)
    }
  }

  const handleProductClick = (productId: number) => {
    router.push(`/products/${productId}`)
    setShowPopover(false)
  }

  const handlePlaceOrder = async () => {
    if (isPlacingOrder || cartItems.length === 0) return
    
    setIsPlacingOrder(true)
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      
      const data = await response.json()
      if (data.success) {
        setCartItems([])
        setShowPopover(false)
        router.push(`/order/${data.orderId}`)
      } else {
        console.error('Failed to place order:', data.error)
      }
    } catch (error) {
      console.error('Failed to place order:', error)
    } finally {
      setIsPlacingOrder(false)
    }
  }

  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0)
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  )

  return (
    <div className="cart-container">
      <button
        className="cart-button"
        onClick={() => setShowPopover(!showPopover)}
        aria-label="Shopping Cart"
      >
        <span className="cart-icon">🛒</span>
        <span className="cart-badge">{totalItems}</span>
      </button>

      {showPopover && (
        <div className="cart-popover" ref={popoverRef}>
          <div className="cart-popover-header">
            <h3>Your Shopping Cart</h3>
            <button className="cart-close-button" onClick={() => setShowPopover(false)}>
              ✕
            </button>
          </div>

          {isLoading ? (
            <div className="cart-loading">Loading cart...</div>
          ) : cartItems.length === 0 ? (
            <div className="cart-empty">
              <p>Your cart is empty</p>
              <button
                className="cart-shop-now"
                onClick={() => {
                  router.push('/products')
                  setShowPopover(false)
                }}
              >
                Shop Now
              </button>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {cartItems.map((item) => (
                  <div className="cart-item" key={item.id}>
                    <div
                      id={`cart_item_${item.productId}`}
                      className="cart-item-details"
                      onClick={() => handleProductClick(item.productId)}
                    >
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="cart-item-image"
                      />
                      <div className="cart-item-info">
                        <h4 className="cart-item-name">{item.product.name}</h4>
                        <p className="cart-item-price">${item.product.price}</p>
                        <div className="cart-item-quantity">Qty: {item.quantity}</div>
                      </div>
                      <button
                        className="cart-item-remove"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveItem(item.productId);
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="cart-footer">
                <div className="cart-total">
                  <span>Total:</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="cart-actions">
                  <button 
                    className="place-order-in-cart"
                    onClick={handlePlaceOrder}
                    disabled={isPlacingOrder}
                  >
                    {isPlacingOrder ? 'Processing...' : 'Place Order'}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}