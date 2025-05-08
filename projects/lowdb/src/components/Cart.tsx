'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/auth'
import './Cart.css'
import { createOrder } from '@/actions/order'

interface CartItem {
  productId: string
  name: string
  price: number
  image: string
  quantity: number
}

export default function Cart() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isCreatingOrder, setIsCreatingOrder] = useState(false)
  const { auth } = useAuth()
  const router = useRouter()
  const popoverRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (auth?.username) {
      fetchCart()
    } else {
      setCart([])
    }
  }, [auth])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const fetchCart = useCallback(async () => {
    try {
      const response = await fetch('/api/cart')
      const data = await response.json()
      if (data.success) {
        setCart(data.items)
      }
    } catch (error) {
      console.error('Failed to fetch cart:', error)
    }
  }, [])

  useEffect(() => {
    window.addEventListener('cartUpdated', fetchCart)
    return () => window.removeEventListener('cartUpdated', fetchCart)
  }, [])

  const handleRemoveItem = async (productId: string) => {
    try {
      const response = await fetch(`/api/cart/${productId}`, {
        method: 'DELETE',
      })
      const data = await response.json()
      if (data.success) {
        setCart(cart.filter((item) => item.productId !== productId))
      }
    } catch (error) {
      console.error('Failed to remove item:', error)
    }
  }

  const handlePlaceOrder = async () => {
    if (!auth?.username) {
      router.push('/login')
      return
    }

    if (cart.length === 0) return

    setIsCreatingOrder(true)
    try {
      const result = await createOrder()

      if (result.success) {
        setCart([])
        setIsOpen(false)
        router.push(`/order/${result.orderId}`)
      } else {
        alert(result.error || 'Failed to create order')
      }
    } catch (error) {
      console.error('Failed to create order:', error)
      alert('An error occurred while creating your order')
    } finally {
      setIsCreatingOrder(false)
    }
  }

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <div className="cart-container">
      <button className="cart-button" onClick={() => setIsOpen(!isOpen)}>
        🛒 <span className="cart-count">{totalItems}</span>
      </button>

      {isOpen && (
        <div className="cart-popover" ref={popoverRef}>
          <div className="cart-header">
            <h3>Your Cart</h3>
            <button className="cart-close" onClick={() => setIsOpen(false)}>
              ×
            </button>
          </div>

          {cart.length === 0 ? (
            <div className="cart-empty">Your cart is empty</div>
          ) : (
            <>
              <div className="cart-items">
                {cart.map((item) => (
                  <div
                    className="cart-item"
                    id={`cart_item_${item.productId}`}
                    key={item.productId}
                  >
                    <img
                      className="cart-item-image"
                      src={item.image}
                      alt={item.name}
                      onClick={() => {
                        router.push(`/products/${item.productId}`)
                        setIsOpen(false)
                      }}
                    />
                    <div className="cart-item-details">
                      <div
                        className="cart-item-name"
                        onClick={() => {
                          router.push(`/products/${item.productId}`)
                          setIsOpen(false)
                        }}
                      >
                        {item.name}
                      </div>
                      <div className="cart-item-price">${item.price}</div>
                      <div className="cart-item-quantity">Qty: {item.quantity}</div>
                    </div>
                    <button
                      className="cart-item-remove"
                      onClick={() => handleRemoveItem(item.productId)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>

              <div className="cart-footer">
                <div className="cart-total">
                  Total: <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="cart-buttons">
                  <button
                    className="place-order-in-cart"
                    onClick={handlePlaceOrder}
                    disabled={isCreatingOrder}
                  >
                    {isCreatingOrder ? 'Processing...' : 'Place Order'}
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
