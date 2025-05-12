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
  <div class="admin-panel">
    <h1>Admin Portal - Orders Management</h1>
    
    <div v-if="isLoading" class="loading">Loading orders...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else class="admin-table-container">
      <table class="admin-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Username</th>
            <th>Date</th>
            <th>Status</th>
            <th>Total Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in orders" :key="order.id" :id="`admin_order_${order.id}`">
            <td>{{ order.id }}</td>
            <td>{{ order.username }}</td>
            <td>{{ new Date(order.created_at).toLocaleString() }}</td>
            <td :class="`status-${order.status.toLowerCase().replace(' ', '-')}`">{{ order.status }}</td>
            <td>${{ order.total_price.toFixed(2) }}</td>
            <td>
              <button 
                v-if="order.status === 'Refund Reviewing'"
                @click="passRefundReview(order.id)"
                class="pass-refund-review-button"
                :disabled="processingOrderId === order.id"
              >
                {{ processingOrderId === order.id ? 'Processing...' : 'Pass Refund' }}
              </button>
              <span v-else>-</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { useUser } from '~/composables/useUser'

const { user } = useUser()
const router = useRouter()
const isLoading = ref(true)
const error = ref(null)
const orders = ref([])
const processingOrderId = ref(null)

// Redirect if not admin
onMounted(async () => {
  await fetchOrders()
  if (!user.value || user.value.role !== 'admin') {
    router.push('/login')
  }
})

async function fetchOrders() {
  isLoading.value = true
  error.value = null

  try {
    const response = await $fetch('/api/admin/orders')
    orders.value = response.orders || []
  } catch (err) {
    error.value = 'Failed to load orders'
    console.error('Orders error:', err)
  } finally {
    isLoading.value = false
  }
}

async function passRefundReview(orderId) {
  processingOrderId.value = orderId
  
  try {
    const response = await $fetch(`/api/admin/orders/${orderId}/refund/approve`, {
      method: 'POST'
    })
    
    if (response.success) {
      // Refresh orders list
      await fetchOrders()
    }
  } catch (err) {
    console.error('Failed to approve refund:', err)
  } finally {
    processingOrderId.value = null
  }
}
</script>

<style scoped>
.admin-panel {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  color: #2c3e50;
  margin-bottom: 2rem;
  text-align: center;
}

.admin-table-container {
  overflow-x: auto;
}

.admin-table {
  width: 100%;
  border-collapse: collapse;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: white;
}

.admin-table th,
.admin-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.admin-table th {
  background-color: #f8f9fa;
  font-weight: bold;
  color: #2c3e50;
}

.admin-table tr:hover {
  background-color: #f5f5f5;
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

.status-pending-payment {
  color: #f39c12;
  font-weight: bold;
}

.status-processing {
  color: #3498db;
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

.pass-refund-review-button {
  background-color: #27ae60;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.pass-refund-review-button:hover:not(:disabled) {
  background-color: #219653;
  transform: translateY(-2px);
}

.pass-refund-review-button:disabled {
  background-color: #95a5a6;
  cursor: not-allowed;
}
</style>