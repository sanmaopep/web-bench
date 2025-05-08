<template>
  <div class="profile-container">
    <h1 class="profile-username">{{ profile?.username }}</h1>
    <div class="profile-coin">Coins: {{ profile?.coin }}</div>
    <button
      v-if="isCurrentUser"
      @click="handleRecharge"
      class="recharge-button"
      :disabled="isLoading"
    >
      {{ isLoading ? 'Recharging...' : 'Recharge 1000 Coins' }}
    </button>

    <div v-if="isCurrentUser" class="referral-section">
      <h2>Your Referral Program</h2>
      <div class="referral-code-container">
        <span>Your Referral Code:</span>
        <div class="referral-code">{{ profile?.username }}</div>
        <button @click="copyReferralCode" class="copy-code-button">
          {{ copied ? 'Copied!' : 'Copy Code' }}
        </button>
      </div>
      <p class="referral-rules">
        When a new user registers through your referral code, you will earn $888, and an additional $1888 when they pay for their first order.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Profile {
  username: string
  coin: number
}

interface CurrentUser {
  username: string
  role: string
}

const route = useRoute()
const isLoading = ref(false)
const copied = ref(false)
const { data: profile, refresh } = await useFetch<Profile>(`/api/profile/${route.params.username}`)

// Check if user has permission to view this profile
const { data: currentUser } = await useFetch<CurrentUser>('/api/simple_auth')
if (!currentUser.value) {
  navigateTo('/login')
} else if (
  currentUser.value.role !== 'admin' &&
  currentUser.value.username !== route.params.username
) {
  navigateTo('/login')
}

const isCurrentUser = computed(() => {
  return currentUser.value?.username === route.params.username
})

async function handleRecharge() {
  if (isLoading.value) return

  isLoading.value = true
  try {
    await $fetch(`/api/profile/${route.params.username}/recharge`, {
      method: 'POST',
    })
    await refresh()
  } catch (error) {
    console.error('Recharge failed:', error)
  } finally {
    isLoading.value = false
  }
}

function copyReferralCode() {
  if (profile.value) {
    navigator.clipboard.writeText(profile.value.username)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  }
}
</script>

<style scoped>
.profile-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.profile-username {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #333;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 1rem;
}

.profile-coin {
  font-size: 1.5rem;
  color: #666;
  padding: 1rem;
  background-color: #f9f9f9;
  border-radius: 6px;
  margin-bottom: 1.5rem;
  font-weight: bold;
}

.recharge-button {
  background-color: #27ae60;
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: bold;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.recharge-button:hover {
  background-color: #219653;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.recharge-button:active {
  transform: translateY(0);
}

.recharge-button:disabled {
  background-color: #95a5a6;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.referral-section {
  margin-top: 2.5rem;
  padding-top: 2rem;
  border-top: 2px solid #f0f0f0;
}

.referral-section h2 {
  font-size: 1.6rem;
  color: #333;
  margin-bottom: 1.5rem;
}

.referral-code-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1.5rem;
}

.referral-code-container > span {
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 0.5rem;
}

.referral-code {
  font-size: 1.8rem;
  font-weight: bold;
  color: #e74c3c;
  background-color: #fdf2f0;
  padding: 1rem 2rem;
  border-radius: 6px;
  border: 2px dashed #e74c3c;
  margin-bottom: 1rem;
  letter-spacing: 2px;
}

.copy-code-button {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.copy-code-button:hover {
  background-color: #2980b9;
  transform: translateY(-2px);
}

.referral-rules {
  background-color: #e8f7f0;
  border-left: 4px solid #27ae60;
  padding: 1.2rem;
  text-align: left;
  line-height: 1.6;
  color: #333;
  border-radius: 4px;
  font-size: 1rem;
}
</style>