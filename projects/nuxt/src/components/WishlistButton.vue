<template>
  <button
    @click="toggleWishlist"
    class="add-to-wishlist"
    :class="{ 'in-wishlist': isInWishlist }"
    :disabled="isLoading"
  >
    <span v-if="isLoading">Loading...</span>
    <span v-else>{{ isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist' }}</span>
  </button>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUser } from '~/composables/useUser'

const props = defineProps({
  productId: {
    type: Number,
    required: true,
  },
})

const { user } = useUser()
const isInWishlist = ref(false)
const isLoading = ref(false)

// Check if product is in wishlist
onMounted(async () => {
  if (user.value) {
    isLoading.value = true
    try {
      const response = await $fetch(`/api/wishlist/check/${props.productId}`)
      isInWishlist.value = response.inWishlist || false
    } catch (error) {
      console.error('Failed to check wishlist status:', error)
    } finally {
      isLoading.value = false
    }
  }
})

async function toggleWishlist() {
  if (!user.value || isLoading.value) return

  isLoading.value = true
  try {
    if (isInWishlist.value) {
      await $fetch(`/api/wishlist/${props.productId}`, { method: 'DELETE' })
    } else {
      await $fetch('/api/wishlist', {
        method: 'POST',
        body: { productId: props.productId },
      })
    }
    isInWishlist.value = !isInWishlist.value
  } catch (error) {
    console.error('Wishlist operation failed:', error)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.add-to-wishlist {
  background-color: #f39c12;
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
  align-self: flex-start;
  margin-top: 1rem;
}

.add-to-wishlist:hover:not(:disabled) {
  background-color: #e67e22;
}

.add-to-wishlist:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.add-to-wishlist.in-wishlist {
  background-color: #e74c3c;
}

.add-to-wishlist.in-wishlist:hover:not(:disabled) {
  background-color: #c0392b;
}
</style>