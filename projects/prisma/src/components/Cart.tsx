'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/auth'
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
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [placingOrder, setPlacingOrder] = useState(false)
  const cartRef = useRef<HTMLDivElement>(null)
  const { auth } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!auth?.username) {
      setCartItems([])
      setLoading(false)
      return
    }

    fetchCartItems()
  }, [auth])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  useEffect(() => {
    const handleCartUpdate = () => {
      fetchCartItems()
    }

    window.addEventListener('cart:updated', handleCartUpdate)
    return () => {
      window.removeEventListener('cart:updated', handleCartUpdate)
    }
  }, [])

  const fetchCartItems = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/cart')
      const data = await response.json()

      if (data.success) {
        setCartItems(data.cart)
      }
      setLoading(false)
    } catch (error) {
      console.error('Error fetching cart:', error)
      setLoading(false)
    }
  }

  const handleRemoveFromCart = async (itemId: number) => {
    try {
      const response = await fetch(`/api/cart/${itemId}`, {
        method: 'DELETE',
      })

      const data = await response.json()
      if (data.success) {
        setCartItems(cartItems.filter((item) => item.id !== itemId))
      }
    } catch (error) {
      console.error('Error removing from cart:', error)
    }
  }

  const handleCheckout = () => {
    router.push('/checkout')
    setIsOpen(false)
  }

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) return;
    
    setPlacingOrder(true);
    try {
      const response = await fetch('/api/orders', {
        method: 'POST'
      });
      
      const data = await response.json();
      
      if (data.success) {
        setCartItems([]);
        setIsOpen(false);
        router.push(`/order/${data.data.orderId}`);
      }
    } catch (error) {
      console.error('Error placing order:', error);
    } finally {
      setPlacingOrder(false);
    }
  }

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0)
  }

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0)
  }

  return (
    <div className="cart-container" ref={cartRef}>
      <button className="cart-button" onClick={() => setIsOpen(!isOpen)} aria-label="Shopping Cart">
        🛒
        {!loading && <span className="cart-count">{getTotalItems()}</span>}
      </button>

      {isOpen && (
        <div className="cart-popover">
          <div className="cart-header">
            <h2>Your Cart</h2>
            <button className="cart-close" onClick={() => setIsOpen(false)}>
              ✕
            </button>
          </div>

          {loading ? (
            <div className="cart-loading">Loading...</div>
          ) : cartItems.length === 0 ? (
            <div className="cart-empty">
              <p>Your cart is empty</p>
              <button
                className="cart-browse-products"
                onClick={() => {
                  router.push('/products')
                  setIsOpen(false)
                }}
              >
                Browse Products
              </button>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {cartItems.map((item) => (
                  <div key={item.id} className="cart-item" id={`cart_item_${item.product.id}`}>
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="cart-item-image"
                      onClick={() => {
                        router.push(`/products/${item.product.id}`)
                        setIsOpen(false)
                      }}
                    />
                    <div className="cart-item-details">
                      <h3 className="cart-item-name">{item.product.name}</h3>
                      <p className="cart-item-price">${item.product.price}</p>
                      <p className="cart-item-quantity">Qty: {item.quantity}</p>
                      <button
                        className="cart-item-remove"
                        onClick={() => handleRemoveFromCart(item.id)}
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
                  <span>${getTotalPrice()}</span>
                </div>
                <button className="place-order-in-cart" onClick={handlePlaceOrder} disabled={placingOrder}>
                  {placingOrder ? 'Processing...' : 'Place Order'}
                </button>
                <button className="cart-checkout" onClick={handleCheckout}>
                  Checkout
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}