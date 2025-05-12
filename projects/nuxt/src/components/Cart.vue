<!-- 
Copyright (c) 2025 Bytedance Ltd. and/or its affiliates

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
 -->

<template>
  <div class="cart-container">
    <button @click="toggleCart" class="cart-button" :class="{ 'has-items': cartItems.length > 0 }">
      🛒 <span class="cart-count">{{ cartItemCount }}</span>
    </button>

    <div class="cart-popover" v-if="showCart">
      <div class="cart-header">
        <h3>Your Cart</h3>
        <button @click="toggleCart" class="cart-close">×</button>
      </div>

      <div v-if="isLoading" class="cart-loading">Loading cart...</div>
      <div v-else-if="error" class="cart-error">{{ error }}</div>
      <div v-else-if="cartItems.length === 0" class="cart-empty">
        Your cart is empty. Start shopping!
      </div>
      <div v-else class="cart-items">
        <div v-for="item in cartItems" :key="item.id" :id="`cart_item_${item.id}`" class="cart-item">
          <img class="cart-item-image" :src="item.image" :alt="item.name" />
          <div class="cart-item-details">
            <div class="cart-item-name">{{ item.name }}</div>
            <div class="cart-item-price">${{ item.price.toFixed(2) }}</div>
            <div class="cart-item-quantity">Qty: {{ item.quantity }}</div>
            <button @click="removeFromCart(item.id)" class="cart-item-remove">Remove</button>
          </div>
        </div>
      </div>

      <div class="cart-footer" v-if="cartItems.length > 0">
        <div class="cart-total">Total: ${{ cartTotal.toFixed(2) }}</div>
        <button class="cart-checkout">Checkout</button>
        <OrderButton :items="cartItems" :on-order-placed="handleOrderPlaced" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useUser } from '~/composables/useUser'
import { useCart } from '~/composables/useCart'
import OrderButton from './OrderButton.vue'

const { user } = useUser()
const showCart = ref(false)
const isLoading = ref(false)
const error = ref(null)
const { cartItems, removeFromCart, fetchCartItems, clearCart } = useCart()

const cartTotal = computed(() => {
  return cartItems.value.reduce((total, item) => {
    return total + item.price * item.quantity
  }, 0)
})

const cartItemCount = computed(() => {
  return cartItems.value.reduce((total, item) => {
    return total + item.quantity
  }, 0)
})

function toggleCart() {
  showCart.value = !showCart.value
  if (showCart.value) {
    fetchCartItems()
  }
}

function handleOrderPlaced() {
  clearCart()
  showCart.value = false
}

// Close cart when clicking outside
function handleClickOutside(event) {
  const cartContainer = document.querySelector('.cart-container')
  if (showCart.value && cartContainer && !cartContainer.contains(event.target)) {
    showCart.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  if (user.value) {
    fetchCartItems()
  }
})

watch(
  () => user.value,
  (newValue) => {
    if (newValue) {
      fetchCartItems()
    } else {
      cartItems.value = []
    }
  }
)
</script>

<style scoped>
.cart-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
}

.cart-button {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #3498db;
  color: white;
  border: none;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  position: relative;
}

.cart-button.has-items {
  background-color: #e74c3c;
}

.cart-button:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.25);
}

.cart-count {
  position: absolute;
  top: -8px;
  right: -8px;
  background-color: #e74c3c;
  color: white;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.cart-popover {
  position: absolute;
  bottom: 70px;
  right: 0;
  background-color: white;
  width: 350px;
  max-height: 500px;
  border-radius: 8px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #eee;
}

.cart-header h3 {
  margin: 0;
  color: #2c3e50;
}

.cart-close {
  border: none;
  background: none;
  font-size: 24px;
  cursor: pointer;
  color: #7f8c8d;
  padding: 0;
  line-height: 1;
}

.cart-close:hover {
  color: #e74c3c;
}

.cart-items {
  flex: 1;
  overflow-y: auto;
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.cart-item {
  display: flex;
  align-items: center;
  background-color: #f8f9fa;
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.cart-item-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
}

.cart-item-name {
  font-weight: bold;
  color: #2c3e50;
  font-size: 0.9rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.cart-item-details {
  flex: 1;
  padding: 8px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.cart-item-price {
  font-weight: bold;
  color: #e74c3c;
}

.cart-item-quantity {
  color: #7f8c8d;
  font-size: 0.85rem;
}

.cart-item-remove {
  background-color: transparent;
  color: #e74c3c;
  border: 1px solid #e74c3c;
  border-radius: 4px;
  padding: 3px 8px;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
  align-self: flex-start;
  margin-top: 4px;
}

.cart-item-remove:hover {
  background-color: #e74c3c;
  color: white;
}

.cart-footer {
  padding: 15px;
  background-color: #f8f9fa;
  border-top: 1px solid #eee;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.cart-total {
  font-weight: bold;
  font-size: 1.1rem;
  color: #2c3e50;
}

.cart-checkout {
  background-color: #27ae60;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
}

.cart-checkout:hover {
  background-color: #219653;
}

.cart-loading,
.cart-error,
.cart-empty {
  padding: 20px;
  text-align: center;
  color: #7f8c8d;
}

.cart-error {
  color: #e74c3c;
}
</style>