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
  <div class="login-container">
    <h1>💡 Please Login First</h1>
    <form class="login-form" @submit.prevent="handleLogin">
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
      <button type="submit" class="login-btn" :disabled="!isMounted || isLoading">
        {{ isLoading ? 'Logging in...' : 'Login' }}
      </button>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      <p class="register-redirect">
        Don't have an account?
        <NuxtLink to="/register" class="register-link">Register here</NuxtLink>
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
const { refreshAuth } = useUser()
const username = ref('')
const password = ref('')
const errorMessage = ref('')
const isLoading = ref(false)

async function handleLogin() {
  if (!isMounted.value) return

  isLoading.value = true
  errorMessage.value = ''

  try {
    const response = await $fetch('/api/auth', {
      method: 'POST',
      body: {
        username: username.value,
        password: password.value,
      },
    })

    if (response.success) {
      await refreshAuth()
      router.push('/')
    }
  } catch (error) {
    errorMessage.value = 'Login Failed'
    console.error('Login error:', error)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.login-container {
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

.login-form {
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

.login-btn {
  width: 100%;
  background-color: #3498db;
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 4px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 1rem;
}

.login-btn:hover {
  background-color: #2980b9;
}

.error-message {
  color: #e74c3c;
  margin-top: 1rem;
  text-align: center;
  font-weight: 600;
}

.register-redirect {
  margin-top: 1.5rem;
  text-align: center;
  color: #7f8c8d;
}

.register-link {
  color: #27ae60;
  text-decoration: none;
  font-weight: 600;
}

.register-link:hover {
  text-decoration: underline;
}

.login-btn:disabled,
input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
  opacity: 0.7;
}

.login-btn:disabled {
  background-color: #95a5a6;
}
</style>
