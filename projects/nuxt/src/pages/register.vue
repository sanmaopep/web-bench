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
  <div class="register-container">
    <h1>🔐 Register New Account</h1>
    <form class="register-form" @submit.prevent="handleRegister">
      <div class="form-group">
        <label for="username">Username</label>
        <input
          id="username"
          type="text"
          v-model="username"
          class="username"
          placeholder="Enter username"
          required
          :disabled="!isMounted || isLoading"
        />
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input
          id="password"
          type="password"
          v-model="password"
          class="password"
          placeholder="Enter password"
          required
          :disabled="!isMounted || isLoading"
        />
      </div>
      <div class="form-group">
        <label for="confirmPassword">Confirm Password</label>
        <input
          id="confirmPassword"
          type="password"
          v-model="confirmPassword"
          class="confirm-password"
          placeholder="Confirm password"
          required
          :disabled="!isMounted || isLoading"
        />
      </div>
      <div class="form-group">
        <label for="referralCode">Referral Code (Optional)</label>
        <input
          id="referralCode"
          type="text"
          v-model="referralCode"
          class="referral-code-input"
          placeholder="Enter referral code if you have one"
          :disabled="!isMounted || isLoading"
        />
      </div>
      <button type="submit" class="register-button" :disabled="!isMounted || isLoading">
        {{ isLoading ? 'Registering...' : 'Register' }}
      </button>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      <p class="login-redirect">
        Already have an account? <NuxtLink to="/login" class="login-link">Login here</NuxtLink>
      </p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useMounted } from '~/composables/useMounted'
import { useUser } from '~/composables/useUser'

const router = useRouter()
const isMounted = useMounted()
const { user, isLoading: userLoading, error: userError, refreshAuth } = useUser()
const username = ref('')
const password = ref('')
const confirmPassword = ref('')
const referralCode = ref('')
const errorMessage = ref('')
const isLoading = ref(false)

async function handleRegister() {
  if (!isMounted.value) return

  isLoading.value = true
  errorMessage.value = ''

  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Passwords must match'
    isLoading.value = false
    return
  }

  try {
    const response = await $fetch('/api/register', {
      method: 'POST',
      body: {
        username: username.value,
        password: password.value,
        referralCode: referralCode.value,
      },
    })

    if (response.success) {
      await refreshAuth()
      router.push('/')
    }
  } catch (error) {
    if (error.statusCode === 409) {
      errorMessage.value = 'Username already exists'
    } else if (error.statusCode === 404) {
      errorMessage.value = 'Invalid referral code'
    } else {
      errorMessage.value = 'Registration failed'
    }
    console.error('Registration error:', error)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.register-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  max-width: 500px;
  margin: 0 auto;
}

h1 {
  color: #2c3e50;
  margin-bottom: 2rem;
  text-align: center;
}

.register-form {
  width: 100%;
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #2c3e50;
}

input {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

input:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
}

.referral-code-input {
  border-color: #f39c12;
  background-color: #fff9e6;
}

.referral-code-input:focus {
  border-color: #f39c12;
  box-shadow: 0 0 0 2px rgba(243, 156, 18, 0.2);
}

.register-button {
  width: 100%;
  background-color: #27ae60;
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 4px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 1rem;
}

.register-button:hover {
  background-color: #219653;
}

.register-button:disabled {
  background-color: #95a5a6;
  cursor: not-allowed;
}

.error-message {
  color: #e74c3c;
  margin-top: 1rem;
  text-align: center;
  font-weight: 600;
}

.login-redirect {
  margin-top: 1.5rem;
  text-align: center;
  color: #7f8c8d;
}

.login-link {
  color: #3498db;
  text-decoration: none;
  font-weight: 600;
}

.login-link:hover {
  text-decoration: underline;
}

input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
  opacity: 0.7;
}
</style>