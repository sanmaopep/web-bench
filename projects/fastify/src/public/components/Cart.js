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

class ShoppingCart extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    this.cartItems = []
    this.isOpen = false
  }

  async connectedCallback() {
    this.render()
    await this.loadCartItems()
    this.addEventListeners()
  }

  async loadCartItems() {
    try {
      const response = await fetch('/api/cart')
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          this.cartItems = data.items || []
          this.updateCartButton()
          this.renderCartItems()
        }
      }
    } catch (error) {
      console.error('Error loading cart items:', error)
    }
  }

  updateCartButton() {
    const itemCount = this.cartItems.reduce((total, item) => total + item.quantity, 0)
    const countElement = this.shadowRoot.querySelector('.cart-count')
    if (countElement) {
      countElement.textContent = itemCount
      countElement.style.display = itemCount > 0 ? 'flex' : 'none'
    }
  }

  async removeFromCart(productId) {
    try {
      const response = await fetch(`/api/cart/${productId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          this.cartItems = this.cartItems.filter((item) => item.product_id !== productId)
          this.updateCartButton()
          this.renderCartItems()
        }
      }
    } catch (error) {
      console.error('Error removing item from cart:', error)
    }
  }

  updateQuantity(productId, newQuantity) {
    if (newQuantity < 1) return

    fetch('/api/cart/update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        productId,
        quantity: newQuantity,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          const itemIndex = this.cartItems.findIndex((item) => item.product_id === productId)
          if (itemIndex !== -1) {
            this.cartItems[itemIndex].quantity = newQuantity
            this.updateCartButton()
            this.renderCartItems()
          }
        }
      })
      .catch((error) => console.error('Error updating quantity:', error))
  }

  calculateTotal() {
    return this.cartItems.reduce((total, item) => {
      return total + item.price * item.quantity
    }, 0)
  }

  toggleCart() {
    this.isOpen = !this.isOpen
    const cartPopover = this.shadowRoot.querySelector('.cart-popover')
    if (cartPopover) {
      cartPopover.style.display = this.isOpen ? 'block' : 'none'
    }
  }

  addEventListeners() {
    const cartButton = this.shadowRoot.querySelector('.cart-button')
    if (cartButton) {
      cartButton.addEventListener('click', () => this.toggleCart())
    }

    // Close cart when clicking outside
    document.addEventListener('click', (event) => {
      if (this.isOpen && !this.contains(event.target)) {
        this.isOpen = false
        const cartPopover = this.shadowRoot.querySelector('.cart-popover')
        if (cartPopover) {
          cartPopover.style.display = 'none'
        }
      }
    })

    // Stop propagation for clicks inside the cart
    this.addEventListener('click', (event) => {
      event.stopPropagation()
    })

    // Event delegation for cart item interactions
    const cartItemsContainer = this.shadowRoot.querySelector('.cart-items')
    if (cartItemsContainer) {
      cartItemsContainer.addEventListener('click', (e) => {
        // Handle remove button click
        if (e.target.classList.contains('cart-item-remove')) {
          const productId = parseInt(e.target.getAttribute('data-product-id'))
          this.removeFromCart(productId)
        }

        // Handle minus button click
        if (e.target.classList.contains('minus')) {
          const productId = parseInt(e.target.getAttribute('data-product-id'))
          const item = this.cartItems.find((item) => item.product_id === productId)
          if (item && item.quantity > 1) {
            this.updateQuantity(productId, item.quantity - 1)
          }
        }

        // Handle plus button click
        if (e.target.classList.contains('plus')) {
          const productId = parseInt(e.target.getAttribute('data-product-id'))
          const item = this.cartItems.find((item) => item.product_id === productId)
          if (item) {
            this.updateQuantity(productId, item.quantity + 1)
          }
        }
      })
    }

    // Add event listener to the place order button
    const placeOrderBtn = this.shadowRoot.querySelector('.place-order-in-cart')
    if (placeOrderBtn) {
      placeOrderBtn.addEventListener('click', () => this.placeOrder())
    }
  }

  async placeOrder() {
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
      })

      const data = await response.json()

      if (data.success) {
        // Clear cart and close popover
        this.cartItems = []
        this.updateCartButton()
        this.renderCartItems()
        this.isOpen = false
        const cartPopover = this.shadowRoot.querySelector('.cart-popover')
        if (cartPopover) {
          cartPopover.style.display = 'none'
        }

        // Redirect to order detail page
        window.location.href = `/order/${data.orderId}`
      } else {
        alert(data.message || 'Failed to place order. Please try again.')
      }
    } catch (error) {
      console.error('Error placing order:', error)
      alert('An error occurred while placing your order.')
    }
  }

  renderCartItems() {
    const cartItemsContainer = this.shadowRoot.querySelector('.cart-items')
    const cartActions = this.shadowRoot.querySelector('.cart-actions')

    if (!cartItemsContainer) return

    if (this.cartItems.length === 0) {
      cartItemsContainer.innerHTML = `
        <div class="empty-cart">
          <p>Your cart is empty</p>
          <a href="/products" class="view-products-link">Browse Products</a>
        </div>
      `

      cartActions.style.display = 'none'
      return
    }

    cartActions.style.display = 'flex'

    let itemsHTML = ''
    this.cartItems.forEach((item) => {
      itemsHTML += `
        <div class="cart-item" id="cart_item_${item.product_id}">
          <img src="${item.image}" alt="${item.name}" class="cart-item-image">
          <div class="cart-item-details">
            <h4 class="cart-item-name">${item.name}</h4>
            <div class="cart-item-price">$${item.price.toFixed(2)}</div>
            <div class="cart-item-quantity-control">
              <button class="quantity-btn minus" data-product-id="${item.product_id}">-</button>
              <span class="cart-item-quantity">${item.quantity}</span>
              <button class="quantity-btn plus" data-product-id="${item.product_id}">+</button>
            </div>
          </div>
          <button class="cart-item-remove" data-product-id="${item.product_id}">×</button>
        </div>
      `
    })

    cartItemsContainer.innerHTML = itemsHTML

    // Update total section
    const totalElement = this.shadowRoot.querySelector('.cart-total-value')
    if (totalElement) {
      totalElement.textContent = `$${this.calculateTotal().toFixed(2)}`
    }
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 1000;
        }

        .cart-button {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background-color: #4a89dc;
          color: white;
          border: none;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          position: relative;
          transition: transform 0.3s ease, background-color 0.3s ease;
        }

        .cart-button:hover {
          background-color: #357bd8;
          transform: scale(1.05);
        }

        .cart-icon {
          font-size: 24px;
        }

        .cart-count {
          position: absolute;
          top: -5px;
          right: -5px;
          background-color: #e74c3c;
          color: white;
          border-radius: 50%;
          width: 22px;
          height: 22px;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 12px;
          font-weight: bold;
        }

        .cart-popover {
          position: absolute;
          bottom: 70px;
          right: 0;
          width: 320px;
          max-height: 400px;
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
          display: none;
          overflow: hidden;
          flex-direction: column;
        }

        .cart-header {
          padding: 15px;
          background-color: #4a89dc;
          color: white;
          font-weight: bold;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .cart-items {
          padding: 10px;
          overflow-y: auto;
          max-height: 280px;
        }

        .cart-item {
          display: flex;
          margin-bottom: 15px;
          padding-bottom: 15px;
          border-bottom: 1px solid #eee;
          position: relative;
        }

        .cart-item:last-child {
          margin-bottom: 0;
          padding-bottom: 0;
          border-bottom: none;
        }

        .cart-item-image {
          width: 60px;
          height: 60px;
          object-fit: cover;
          border-radius: 4px;
          margin-right: 10px;
        }

        .cart-item-details {
          flex: 1;
        }

        .cart-item-name {
          margin: 0 0 5px 0;
          font-size: 14px;
          color: #333;
        }

        .cart-item-price {
          color: #4a89dc;
          font-weight: bold;
          margin-bottom: 5px;
        }

        .cart-item-quantity-control {
          display: flex;
          align-items: center;
        }

        .quantity-btn {
          width: 24px;
          height: 24px;
          background-color: #f0f0f0;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          display: flex;
          justify-content: center;
          align-items: center;
          font-weight: bold;
        }

        .quantity-btn:hover {
          background-color: #e0e0e0;
        }

        .cart-item-quantity {
          margin: 0 10px;
          font-weight: bold;
        }

        .cart-item-remove {
          position: absolute;
          top: 0;
          right: 0;
          background-color: transparent;
          color: #e74c3c;
          border: none;
          font-size: 18px;
          cursor: pointer;
          padding: 0 5px;
        }

        .cart-footer {
          padding: 15px;
          background-color: #f8f9fa;
          border-top: 1px solid #eee;
        }

        .cart-total {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
          font-weight: bold;
        }

        .cart-total-value {
          color: #4a89dc;
        }

        .cart-actions {
          display: flex;
          gap: 10px;
        }

        .checkout-btn, .place-order-in-cart {
          padding: 10px;
          background-color: #27ae60;
          color: white;
          border: none;
          border-radius: 4px;
          font-weight: bold;
          cursor: pointer;
          transition: background-color 0.3s ease;
          flex: 1;
        }

        .checkout-btn:hover, .place-order-in-cart:hover {
          background-color: #219653;
        }

        .empty-cart {
          text-align: center;
          padding: 20px;
          color: #777;
        }

        .view-products-link {
          display: inline-block;
          margin-top: 10px;
          color: #4a89dc;
          text-decoration: none;
          font-weight: bold;
        }

        .view-products-link:hover {
          text-decoration: underline;
        }
      </style>

      <button class="cart-button">
        <span class="cart-icon">🛒</span>
        <span class="cart-count" style="display: none;">0</span>
      </button>

      <div class="cart-popover">
        <div class="cart-header">
          <span>Your Shopping Cart</span>
          <span class="cart-close">✕</span>
        </div>
        <div class="cart-items">
          <!-- Cart items will be rendered here -->
        </div>
        <div class="cart-footer">
          <div class="cart-total">
            <span>Total:</span>
            <span class="cart-total-value">$0.00</span>
          </div>
          <div class="cart-actions" style="display: none;">
            <button class="place-order-in-cart">Place Order</button>
          </div>
        </div>
      </div>
    `

    this.renderCartItems()
  }
}

customElements.define('shopping-cart', ShoppingCart)
