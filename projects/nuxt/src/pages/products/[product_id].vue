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
  <div class="product-detail">
    <div v-if="product" class="product-card">
      <img class="product-image" :src="product.image" :alt="product.name" />
      <div class="product-info-header">
        <div class="product-name">{{ product.name }}</div>
        <div v-if="productRating" class="product-average-rating">{{ productRating.toFixed(1) }}</div>
      </div>
      <div class="product-price">${{ product.price }}</div>
      <div class="product-quantity">Quantity: {{ product.quantity }}</div>
      <div class="product-description">{{ product.description }}</div>
      <div class="product-actions">
        <WishlistButton v-if="user" :product-id="product.id" />
        <button v-if="user" @click="addToCart" class="add-to-cart-button" :disabled="isLoading">
          {{ isLoading ? 'Adding...' : 'Add to Cart' }}
        </button>
      </div>

      <div v-if="canComment" class="comment-section">
        <h3>Leave a Review</h3>
        <form @submit.prevent="submitComment" class="comment-form">
          <div class="rating-container">
            <div class="rate-input">
              <span 
                v-for="star in 5" 
                :key="star" 
                :class="[`rate-${star}-star`, { active: userRating >= star }]"
                @click="userRating = star"
              >★</span>
            </div>
          </div>
          <textarea 
            v-model="userComment" 
            class="comment-textarea" 
            placeholder="Share your thoughts about this product..." 
            required
          ></textarea>
          <button type="submit" class="comment-submit-button" :disabled="isSubmittingComment">
            {{ isSubmittingComment ? 'Submitting...' : 'Submit Review' }}
          </button>
        </form>
      </div>

      <div class="comments-section">
        <h3>Customer Reviews</h3>
        <div v-if="comments.length === 0" class="no-comments">
          No reviews yet. Be the first to review this product!
        </div>
        <div v-else class="comments-list">
          <div v-for="comment in comments" :key="comment.id" class="comment-item">
            <div class="comment-header">
              <div class="comment-username">{{ comment.username }}</div>
              <div class="comment-rating">{{ comment.rating }}</div>
            </div>
            <div class="comment-text">{{ comment.comment }}</div>
            <div class="comment-date">{{ new Date(comment.created_at).toLocaleDateString() }}</div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="not-found">Product Not Found</div>
  </div>
</template>

<script setup>
import { useUser } from '~/composables/useUser'
import { useCart } from '~/composables/useCart'
import { ref, onMounted, computed } from 'vue'

const route = useRoute()
const { data } = await useFetch(`/api/products/${route.params.product_id}`)
const product = computed(() => data.value?.product)
const { user } = useUser()
const isLoading = ref(false)
const { addToCart: addToCartGlobal } = useCart()
const comments = ref([])
const userComment = ref('')
const userRating = ref(0)
const isSubmittingComment = ref(false)
const canComment = ref(false)
const productRating = computed(() => {
  if (!comments.value.length) return 0
  const sum = comments.value.reduce((total, comment) => total + comment.rating, 0)
  return sum / comments.value.length
})

onMounted(async () => {
  await fetchComments()
  if (user.value) {
    await checkIfCanComment()
  }
})

async function fetchComments() {
  try {
    const response = await $fetch(`/api/comments/${route.params.product_id}`)
    comments.value = response.comments
  } catch (error) {
    console.error('Failed to fetch comments:', error)
  }
}

async function checkIfCanComment() {
  try {
    const response = await $fetch(`/api/comments/check/${route.params.product_id}`)
    canComment.value = response.canComment
  } catch (error) {
    console.error('Failed to check comment permission:', error)
  }
}

async function submitComment() {
  if (!user.value || !userRating.value || isSubmittingComment.value) return

  isSubmittingComment.value = true
  try {
    await $fetch('/api/comments', {
      method: 'POST',
      body: {
        productId: product.value.id,
        rating: userRating.value,
        comment: userComment.value,
      },
    })
    userComment.value = ''
    userRating.value = 0
    await fetchComments()
    canComment.value = false
  } catch (error) {
    console.error('Failed to submit comment:', error)
  } finally {
    isSubmittingComment.value = false
  }
}

async function addToCart() {
  if (!user.value || isLoading.value) return

  isLoading.value = true
  try {
    await addToCartGlobal(product.value.id)
    // Show some feedback
    const toast = document.createElement('div')
    toast.className = 'toast-notification'
    toast.textContent = 'Added to cart!'
    document.body.appendChild(toast)

    setTimeout(() => {
      document.body.removeChild(toast)
    }, 3000)
  } catch (error) {
    console.error('Failed to add to cart:', error)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.product-detail {
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.product-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.product-info-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.product-average-rating {
  background-color: #f39c12;
  color: white;
  font-weight: bold;
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  font-size: 1rem;
}

.product-image {
  width: 100%;
  max-width: 400px;
  height: auto;
  border-radius: 4px;
  margin: 0 auto;
}

.product-name {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
}

.product-price {
  font-size: 1.25rem;
  color: #e44d26;
  font-weight: bold;
}

.product-quantity {
  font-size: 1rem;
  color: #666;
}

.product-description {
  font-size: 1rem;
  color: #444;
  line-height: 1.5;
}

.not-found {
  text-align: center;
  font-size: 1.5rem;
  color: #666;
  margin-top: 2rem;
}

.product-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.add-to-cart-button {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
  font-weight: bold;
}

.add-to-cart-button:hover:not(:disabled) {
  background-color: #2980b9;
}

.add-to-cart-button:disabled {
  background-color: #95a5a6;
  cursor: not-allowed;
}

.toast-notification {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #27ae60;
  color: white;
  padding: 10px 20px;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  z-index: 1001;
  animation: fadeInOut 3s ease;
}

@keyframes fadeInOut {
  0% {
    opacity: 0;
    transform: translate(-50%, 20px);
  }
  15% {
    opacity: 1;
    transform: translate(-50%, 0);
  }
  85% {
    opacity: 1;
    transform: translate(-50%, 0);
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -20px);
  }
}

.comment-section, .comments-section {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #eee;
}

.comment-section h3, .comments-section h3 {
  font-size: 1.3rem;
  color: #2c3e50;
  margin-bottom: 1rem;
}

.comment-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.rating-container {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
}

.rate-input {
  display: flex;
  flex-direction: row-reverse;
  font-size: 1.5rem;
}

.rate-input span {
  color: #ddd;
  cursor: pointer;
  padding: 0 0.2rem;
  transition: color 0.2s;
}

.rate-input span.active {
  color: #f39c12;
}

.rate-input span:hover,
.rate-input span:hover ~ span {
  color: #f39c12;
}

.comment-textarea {
  width: 100%;
  min-height: 100px;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: vertical;
  font-family: inherit;
  line-height: 1.5;
}

.comment-submit-button {
  background-color: #27ae60;
  color: white;
  border: none;
  padding: 0.8rem;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
  font-weight: bold;
  align-self: flex-end;
}

.comment-submit-button:hover:not(:disabled) {
  background-color: #219653;
}

.comment-submit-button:disabled {
  background-color: #95a5a6;
  cursor: not-allowed;
}

.no-comments {
  color: #7f8c8d;
  text-align: center;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 4px;
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 1rem;
}

.comment-item {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 1.2rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.comment-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.8rem;
}

.comment-username {
  font-weight: bold;
  color: #2c3e50;
}

.comment-rating {
  background-color: #f39c12;
  color: white;
  font-weight: bold;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.85rem;
}

.comment-text {
  color: #34495e;
  line-height: 1.6;
  margin-bottom: 0.8rem;
}

.comment-date {
  color: #95a5a6;
  font-size: 0.85rem;
  text-align: right;
}
</style>