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

class Cart extends HTMLElement {
  constructor() {
    super()
    this.render().then(() => {
      this.setupListeners()
    })
  }

  async checkLoginStatus() {
    const res = await fetch('/api/auth')
    const data = await res.json()
    this.username = data.username
    return data
  }

  async render() {
    if (!this.username) {
      await this.checkLoginStatus()
    }

    const res = await fetch('/api/cart')
    const data = await res.json()
    const items = data.items || []

    const styles = `
      .cart-button {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: #2196f3;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        position: fixed;
        right: 20px;
        bottom: 20px;
        z-index: 1000;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
      }

      .cart-count {
        position: absolute;
        top: -5px;
        right: -5px;
        background: #ff5252;
        color: white;
        border-radius: 50%;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
      }

      .cart-icon {
        color: white;
        font-size: 24px;
      }

      .cart-popover {
        position: fixed;
        bottom: 100px;
        right: 20px;
        width: 300px;
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        padding: 15px;
        display: none;
      }

      .cart-popover.show {
        display: block;
      }

      .cart-item {
        display: flex;
        align-items: center;
        padding: 10px 0;
        border-bottom: 1px solid #eee;
      }

      .cart-item img {
        width: 50px;
        height: 50px;
        object-fit: cover;
        border-radius: 4px;
        margin-right: 10px;
      }

      .cart-item-info {
        flex: 1;
      }

      .cart-item-title {
        font-weight: 500;
        margin-bottom: 5px;
      }

      .cart-item-price {
        color: #666;
        font-size: 14px;
      }

      .cart-item-quantity {
        margin: 0 10px;
      }

      .cart-item-remove {
        background: none;
        border: none;
        color: #ff5252;
        cursor: pointer;
        padding: 5px;
      }

      .cart-total {
        margin-top: 15px;
        padding-top: 15px;
        border-top: 2px solid #eee;
        text-align: right;
        font-weight: 500;
      }

      .place-order-in-cart {
        display: block;
        width: 100%;
        background: #4CAF50;
        color: white;
        border: none;
        padding: 12px;
        border-radius: 4px;
        margin-top: 15px;
        cursor: pointer;
        font-weight: 500;
        transition: background 0.2s;
      }

      .place-order-in-cart:hover {
        background: #45a049;
      }

      .place-order-in-cart:disabled {
        background: #ccc;
        cursor: not-allowed;
      }
    `

    this.innerHTML = `
      <style>${styles}</style>
      <button class="cart-button">
        <span class="cart-icon">🛒</span>
        <span class="cart-count">${items.reduce((sum, item) => sum + item.quantity, 0)}</span>
      </button>
      <div class="cart-popover">
        ${items
          .map(
            (item) => `
          <div class="cart-item" id="cart_item_${item.productId}">
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-info">
              <div class="cart-item-title">${item.name}</div>
              <div class="cart-item-price">$${item.price}</div>
            </div>
            <span class="cart-item-quantity">${item.quantity}</span>
            <button class="cart-item-remove" data-product-id="${item.productId}">✕</button>
          </div>
        `
          )
          .join('')}
        <div class="cart-total">
          Total: $${items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}
        </div>
        ${
          items.length !== 0
            ? `
                <button 
                  class="place-order-in-cart" 
                >
                  Place Order
                </button>
          `
            : ''
        }

      </div>

      </div>
    `
  }

  setupListeners() {
    document.addEventListener('click', (e) => {
      if (!this.contains(e.target)) {
        this.querySelector('.cart-popover').classList.remove('show')
      }
    })

    this.addEventListener('click', async (e) => {
      if (this.querySelector('.cart-button').contains(e.target)) {
        this.querySelector('.cart-popover').classList.toggle('show')
      }
      if (e.target.classList.contains('cart-item-remove')) {
        const productId = e.target.dataset.productId
        const res = await fetch('/api/cart/remove', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ productId }),
        })

        const data = await res.json()
        if (data.success) {
          this.render()
        }
      }
      if (e.target.classList.contains('place-order-in-cart')) {
        try {
          const res = await fetch('/api/placeOrder', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          })

          const data = await res.json()
          if (data.orderId) {
            window.location.href = `/order/${data.orderId}`
          }
        } catch (err) {
          console.error('Failed to place order:', err)
        }
      }
    })
  }
}

customElements.define('shopping-cart', Cart)
