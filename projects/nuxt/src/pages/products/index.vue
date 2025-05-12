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
  <div class="products-container">
    <h1>Our Products</h1>
    <div v-if="isLoading" class="loading">Loading products...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else class="product-list">
      <div
        v-for="product in products"
        :key="product.id"
        class="product-card"
        :id="`product_card_${product.id}`"
        @click="navigateToProduct(product.id)"
      >
        <img class="product-image" :src="product.image" :alt="product.name" />
        <div class="product-name">{{ product.name }}</div>
        <div class="product-price">${{ product.price.toFixed(2) }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
const router = useRouter()
const { data, error, pending } = await useFetch('/api/products')
const products = computed(() => data.value?.products || [])
const isLoading = computed(() => pending.value)

function navigateToProduct(id) {
  router.push(`/products/${id}`)
}
</script>

<style scoped>
.products-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
}

h1 {
  color: #2c3e50;
  margin-bottom: 2rem;
  text-align: center;
}

.loading,
.error {
  margin: 2rem 0;
  text-align: center;
  font-size: 1.2rem;
}

.error {
  color: #e74c3c;
}

.product-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
  width: 100%;
  max-width: 1200px;
}

.product-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.product-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.product-name {
  padding: 1rem 1rem 0.5rem;
  font-weight: bold;
  font-size: 1.1rem;
  color: #2c3e50;
}

.product-price {
  padding: 0 1rem 1rem;
  font-size: 1.2rem;
  color: #3498db;
  font-weight: bold;
}
</style>
