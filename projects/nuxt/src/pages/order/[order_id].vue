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
  <div class="order-detail-container">
    <h1>Order #{{ orderId }}</h1>

    <div v-if="isLoading" class="loading">Loading order details...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else class="order-detail">
      <div class="order-status">
        Status:
        <span :class="`status-${order.status.toLowerCase().replace(' ', '-')}`">{{
          order.status
        }}</span>
      </div>
      <div class="order-date">Ordered on: {{ new Date(order.created_at).toLocaleString() }}</div>

      <div class="order-items">
        <h2>Order Items</h2>
        <table class="items-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in order.items"
              :key="item.id"
              :id="`product_in_order_${item.product_id}`"
            >
              <td class="product-cell">
                <img :src="item.image" :alt="item.name" class="product-thumbnail" />
                <div class="product-name">{{ item.name }}</div>
              </td>
              <td>${{ item.price.toFixed(2) }}</td>
              <td>{{ item.quantity }}</td>
              <td>${{ (item.price * item.quantity).toFixed(2) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="order-total">
        <div class="total-row">
          <span>Subtotal:</span>
          <span>${{ calculateSubtotal().toFixed(2) }}</span>
        </div>
        <div class="total-row">
          <span>Tax:</span>
          <span>${{ calculateTax().toFixed(2) }}</span>
        </div>
        <div class="total-row grand-total">
          <span>Total:</span>
          <span>${{ order.total_price.toFixed(2) }}</span>
        </div>
      </div>

      <button
        v-if="order.status === 'Pending payment'"
        @click="payOrder"
        class="pay-my-order"
        :disabled="isPaymentProcessing"
      >
        {{ isPaymentProcessing ? 'Processing...' : 'Pay Now' }}
      </button>

      <button
        v-if="order.status === 'Finished'"
        @click="requestRefund"
        class="refund-button"
        :disabled="isRefundProcessing"
      >
        {{ isRefundProcessing ? 'Processing...' : 'Request Refund' }}
      </button>

      <div v-if="paymentError" class="payment-error">
        {{ paymentError }}
      </div>

      <div v-if="paymentSuccess" class="payment-success">
        Payment successful! Thank you for your order.
      </div>

      <div v-if="refundSuccess" class="refund-success">
        Refund request submitted! Your request is being reviewed.
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const orderId = route.params.order_id
const isLoading = ref(true)
const error = ref(null)
const order = ref(null)
const isPaymentProcessing = ref(false)
const isRefundProcessing = ref(false)
const paymentError = ref(null)
const paymentSuccess = ref(false)
const refundSuccess = ref(false)

onMounted(async () => {
  await fetchOrder()
})

async function fetchOrder() {
  isLoading.value = true
  error.value = null

  try {
    const response = await $fetch(`/api/orders/${orderId}`)
    order.value = response.order
  } catch (err) {
    error.value = err.message || 'Failed to load order details'
    console.error('Order fetch error:', err)
  } finally {
    isLoading.value = false
  }
}

async function payOrder() {
  if (isPaymentProcessing.value) return

  isPaymentProcessing.value = true
  paymentError.value = null

  try {
    const response = await $fetch(`/api/orders/${orderId}/pay`, {
      method: 'POST',
    })

    if (response.success) {
      paymentSuccess.value = true
    } else {
      paymentError.value = response.message || 'Payment failed'
    }
  } catch (err) {
    paymentError.value = err.message || 'Payment failed. Please try again.'
    console.error('Payment error:', err)
  } finally {
    isPaymentProcessing.value = false
    await fetchOrder() // Refresh order data to show updated status
  }
}

async function requestRefund() {
  if (isRefundProcessing.value) return

  isRefundProcessing.value = true

  try {
    const response = await $fetch(`/api/orders/${orderId}/refund`, {
      method: 'POST',
    })

    if (response.success) {
      refundSuccess.value = true
      await fetchOrder() // Refresh order data to show updated status
    }
  } catch (err) {
    console.error('Refund request error:', err)
  } finally {
    isRefundProcessing.value = false
  }
}

function calculateSubtotal() {
  if (!order.value || !order.value.items) return 0

  return order.value.items.reduce((total, item) => {
    return total + item.price * item.quantity
  }, 0)
}

function calculateTax() {
  const subtotal = calculateSubtotal()
  return subtotal * 0.05 // 5% tax rate
}
</script>

<style scoped>
.order-detail-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  color: #2c3e50;
  margin-bottom: 2rem;
  text-align: center;
}

h2 {
  color: #2c3e50;
  margin: 1.5rem 0;
  font-size: 1.4rem;
}

.loading,
.error {
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
}

.error {
  color: #e74c3c;
}

.order-detail {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 2rem;
}

.order-status {
  font-size: 1.2rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.status-pending-payment {
  color: #f39c12;
  font-weight: bold;
}

.status-processing {
  color: #3498db;
  font-weight: bold;
}

.status-shipped {
  color: #27ae60;
  font-weight: bold;
}

.status-delivered {
  color: #2ecc71;
  font-weight: bold;
}

.status-cancelled {
  color: #e74c3c;
  font-weight: bold;
}

.status-finished {
  color: #27ae60;
  font-weight: bold;
}

.status-failed {
  color: #e74c3c;
  font-weight: bold;
}

.status-refund-reviewing {
  color: #f39c12;
  font-weight: bold;
}

.status-refund-passed {
  color: #3498db;
  font-weight: bold;
}

.order-date {
  color: #7f8c8d;
  margin-bottom: 2rem;
}

.items-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 2rem;
}

.items-table th {
  background-color: #f8f9fa;
  padding: 1rem;
  text-align: left;
  font-weight: bold;
  color: #2c3e50;
  border-bottom: 1px solid #eee;
}

.items-table td {
  padding: 1rem;
  border-bottom: 1px solid #eee;
  color: #2c3e50;
}

.product-cell {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.product-thumbnail {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
}

.product-name {
  font-weight: bold;
}

.order-total {
  background-color: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  margin-top: 2rem;
}

.total-row {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  font-size: 1.1rem;
}

.grand-total {
  font-weight: bold;
  font-size: 1.4rem;
  border-top: 1px solid #ddd;
  margin-top: 0.5rem;
  padding-top: 1rem;
  color: #2c3e50;
}

.pay-my-order, .refund-button {
  background-color: #27ae60;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 4px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  display: block;
  margin: 2rem auto 0;
  width: 100%;
  max-width: 300px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.pay-my-order:hover:not(:disabled), .refund-button:hover:not(:disabled) {
  background-color: #219653;
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.refund-button {
  background-color: #e74c3c;
}

.refund-button:hover:not(:disabled) {
  background-color: #c0392b;
}

.pay-my-order:disabled, .refund-button:disabled {
  background-color: #95a5a6;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.payment-error {
  margin-top: 1rem;
  padding: 1rem;
  background-color: #f8d7da;
  color: #721c24;
  border-radius: 4px;
  text-align: center;
}

.payment-success, .refund-success {
  margin-top: 1rem;
  padding: 1rem;
  background-color: #d4edda;
  color: #155724;
  border-radius: 4px;
  text-align: center;
  font-weight: bold;
}

.refund-success {
  background-color: #fff3cd;
  color: #856404;
}
</style>