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
  <div class="orders-container">
    <h1>My Orders</h1>
    
    <div v-if="isLoading" class="loading">Loading your orders...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="orders.length === 0" class="empty-orders">
      You haven't placed any orders yet. <NuxtLink to="/products">Start shopping</NuxtLink>
    </div>
    <div v-else class="orders-list">
      <div 
        v-for="order in orders" 
        :key="order.id" 
        :id="`my_order_${order.id}`"
        class="order-card"
        @click="goToOrderDetail(order.id)"
      >
        <div class="order-header">
          <div class="order-id">Order #{{ order.id }}</div>
          <div :class="`order-status status-${order.status.toLowerCase().replace(' ', '-')}`">
            {{ order.status }}
          </div>
        </div>
        <div class="order-date">{{ new Date(order.created_at).toLocaleString() }}</div>
        <div class="order-items-preview">
          <span>{{ order.items.length }} item(s)</span>
        </div>
        <div class="order-price">${{ order.total_price.toFixed(2) }}</div>
        <div class="view-details">View Details →</div>
      </div>
    </div>
  </div>
</template>

<script setup>
const router = useRouter()
const isLoading = ref(true)
const error = ref(null)
const orders = ref([])

onMounted(async () => {
  await fetchOrders()
})

async function fetchOrders() {
  isLoading.value = true
  error.value = null
  
  try {
    const response = await $fetch('/api/orders')
    orders.value = response.orders || []
  } catch (err) {
    if (err.statusCode === 401) {
      router.push('/login')
      return
    }
    error.value = 'Failed to load orders'
    console.error('Orders error:', err)
  } finally {
    isLoading.value = false
  }
}

function goToOrderDetail(orderId) {
  router.push(`/order/${orderId}`)
}
</script>

<style scoped>
.orders-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  color: #2c3e50;
  margin-bottom: 2rem;
  text-align: center;
}

.loading, .error, .empty-orders {
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
}

.error {
  color: #e74c3c;
}

.empty-orders {
  color: #7f8c8d;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 3rem;
}

.empty-orders a {
  color: #3498db;
  text-decoration: none;
  font-weight: bold;
}

.empty-orders a:hover {
  text-decoration: underline;
}

.orders-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.order-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
}

.order-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.order-id {
  font-weight: bold;
  font-size: 1.2rem;
  color: #2c3e50;
}

.order-status {
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: bold;
}

.status-pending-payment {
  background-color: #fff3cd;
  color: #856404;
}

.status-processing {
  background-color: #cce5ff;
  color: #004085;
}

.status-shipped {
  background-color: #d4edda;
  color: #155724;
}

.status-delivered {
  background-color: #d1e7dd;
  color: #0f5132;
}

.status-cancelled {
  background-color: #f8d7da;
  color: #721c24;
}

.order-date {
  color: #7f8c8d;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.order-items-preview {
  color: #7f8c8d;
  margin-bottom: 0.5rem;
}

.order-price {
  font-size: 1.3rem;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 1rem;
}

.view-details {
  color: #3498db;
  font-size: 0.9rem;
  text-align: right;
}

@media (max-width: 768px) {
  .order-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .order-status {
    align-self: flex-start;
  }
}
</style>