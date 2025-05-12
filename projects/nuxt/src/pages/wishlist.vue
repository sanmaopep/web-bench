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
  <div class="wishlist-container">
    <h1>Your Wishlist</h1>

    <div v-if="isLoading" class="loading">Loading wishlist...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="wishlistItems.length === 0" class="empty-wishlist">
      Your wishlist is empty. <NuxtLink to="/products">Browse products</NuxtLink> to add items.
    </div>
    <div v-else class="wishlist-items">
      <div
        v-for="item in wishlistItems"
        :key="item.id"
        class="wishlist-item"
        :id="`wishlist_item_${item.id}`"
      >
        <img class="wishlist-image" :src="item.image" :alt="item.name" />
        <div class="wishlist-details">
          <div class="wishlist-name">{{ item.name }}</div>
          <div class="wishlist-price">${{ item.price.toFixed(2) }}</div>
          <button @click="removeFromWishlist(item.id)" class="remove-from-wishlist">Remove</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
const isLoading = ref(true)
const error = ref(null)
const wishlistItems = ref([])

// Redirect if not logged in
onMounted(async () => {
  await fetchWishlist()
})

async function fetchWishlist() {
  isLoading.value = true
  error.value = null

  try {
    const response = await $fetch('/api/wishlist')
    wishlistItems.value = response.items || []
  } catch (err) {
    if (err.statusCode === 401) {
      router.push('/login')
      return
    }
    error.value = 'Failed to load wishlist'
    console.error('Wishlist error:', err)
  } finally {
    isLoading.value = false
  }
}

async function removeFromWishlist(productId) {
  try {
    await $fetch(`/api/wishlist/${productId}`, { method: 'DELETE' })
    wishlistItems.value = wishlistItems.value.filter((item) => item.id !== productId)
  } catch (err) {
    console.error('Failed to remove from wishlist:', err)
  }
}
</script>

<style src="~/assets/css/wishlist.css" />
