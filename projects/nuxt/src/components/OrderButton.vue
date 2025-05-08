<template>
  <button @click="placeOrder" class="place-order-in-cart" :disabled="isLoading">
    {{ isLoading ? 'Processing...' : 'Place Order' }}
  </button>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  items: {
    type: Array,
    required: true
  },
  onOrderPlaced: {
    type: Function,
    required: true
  }
})

const router = useRouter()
const isLoading = ref(false)

async function placeOrder() {
  if (props.items.length === 0 || isLoading.value) return
  
  isLoading.value = true
  try {
    const response = await $fetch('/api/orders', {
      method: 'POST',
      body: {
        items: props.items.map(item => ({
          productId: item.id,
          quantity: item.quantity
        }))
      }
    })
    
    if (response.success && response.orderId) {
      props.onOrderPlaced()
      router.push(`/order/${response.orderId}`)
    }
  } catch (error) {
    console.error('Failed to place order:', error)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.place-order-in-cart {
  background-color: #27ae60;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
  width: 100%;
  margin-top: 10px;
}

.place-order-in-cart:hover:not(:disabled) {
  background-color: #219653;
}

.place-order-in-cart:disabled {
  background-color: #95a5a6;
  cursor: not-allowed;
}
</style>