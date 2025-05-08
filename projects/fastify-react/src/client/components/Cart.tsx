import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '../context/auth'
import './Cart.css'

interface CartItem {
  id: number
  productId: number
  name: string
  price: number
  image: string
  quantity: number
}

const Cart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const cartRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart()
    } else {
      setCartItems([])
    }
  }, [isAuthenticated])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) return

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/cart')
      const data = await response.json()

      if (data.success) {
        setCartItems(data.items)
      } else {
        setError('Failed to load cart')
      }
    } catch (err) {
      setError('Error connecting to server')
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated])

  useEffect(() => {
    window.addEventListener('cartUpdated', fetchCart)
    return () => {
      window.removeEventListener('cartUpdated', fetchCart)
    }
  }, [fetchCart])

  const handleRemoveFromCart = async (productId: number) => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    try {
      const response = await fetch(`/api/cart/${productId}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (data.success) {
        setCartItems((prev) => prev.filter((item) => item.productId !== productId))
      } else {
        setError('Failed to remove from cart')
      }
    } catch (err) {
      setError('Error connecting to server')
    }
  }

  const handleViewProduct = (productId: number) => {
    setIsOpen(false)
    navigate(`/products/${productId}`)
  }

  const handlePlaceOrder = async () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
      })

      const data = await response.json()

      if (data.success) {
        setCartItems([]) // Clear cart items in state
        setIsOpen(false)
        navigate(`/order/${data.orderId}`)
      } else {
        setError('Failed to place order')
      }
    } catch (err) {
      setError('Error connecting to server')
    }
  }

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0)
  }

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  return (
    <div className="cart-container" ref={cartRef}>
      <button className="cart-button" onClick={() => setIsOpen(!isOpen)}>
        🛒 <span className="cart-count">{getTotalItems()}</span>
      </button>

      {isOpen && (
        <div className="cart-popover">
          <h3 className="cart-title">Your Shopping Cart</h3>

          {loading ? (
            <div className="cart-loading">Loading cart...</div>
          ) : error ? (
            <div className="cart-error">{error}</div>
          ) : cartItems.length === 0 ? (
            <div className="cart-empty">Your cart is empty</div>
          ) : (
            <>
              <div className="cart-items">
                {cartItems.map((item) => (
                  <div className="cart-item" id={`cart_item_${item.productId}`} key={item.id}>
                    <div
                      className="cart-item-info"
                      onClick={() => handleViewProduct(item.productId)}
                    >
                      <img className="cart-item-image" src={item.image} alt={item.name} />
                      <div className="cart-item-details">
                        <div className="cart-item-name">{item.name}</div>
                        <div className="cart-item-price">${item.price.toFixed(2)}</div>
                        <div className="cart-item-quantity">Qty: {item.quantity}</div>
                      </div>
                    </div>
                    <button
                      className="cart-item-remove"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRemoveFromCart(item.productId)
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              <div className="cart-footer">
                <div className="cart-total">Total: ${getTotalPrice().toFixed(2)}</div>
                <button className="place-order-in-cart" onClick={handlePlaceOrder}>
                  Place Order
                </button>
                <button
                  className="checkout-button"
                  onClick={() => {
                    setIsOpen(false)
                    navigate('/checkout')
                  }}
                >
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

export default Cart
