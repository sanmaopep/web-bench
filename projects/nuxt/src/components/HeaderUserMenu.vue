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
  <div class="header-user-menu">
    <template v-if="user">
      <div class="header-user-dropdown">
        <span class="header-username">{{ user.username }}</span>
        <div class="dropdown-content">
          <NuxtLink :to="`/profile/${user.username}`" class="header-go-user-profile">
            Profile
          </NuxtLink>
          <NuxtLink to="/orders" class="header-go-to-my-orders">
            My Orders
          </NuxtLink>
          <button @click="handleLogout" class="header-logout-btn">Logout</button>
        </div>
      </div>
    </template>
    <template v-else>
      <NuxtLink to="/login" class="header-go-login">Login</NuxtLink>
    </template>
  </div>
</template>

<script setup>
import { useUser } from '~/composables/useUser'

const { user, refreshAuth } = useUser()
const router = useRouter()

async function handleLogout() {
  try {
    await $fetch('/api/logout', { method: 'POST' })
    await refreshAuth()
    router.push('/login')
  } catch (error) {
    console.error('Logout failed:', error)
  }
}
</script>

<style scoped>
.header-user-menu {
  position: relative;
  display: flex;
  align-items: center;
}

.header-go-login {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.3s;
  text-decoration: none;
}

.header-go-login:hover {
  background-color: #2980b9;
}

.header-user-dropdown {
  position: relative;
  display: inline-block;
}

.header-username {
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  background-color: #f8f8f8;
  color: #333;
  font-weight: bold;
  display: inline-block;
  transition: background-color 0.3s;
}

.dropdown-content {
  display: none;
  position: absolute;
  right: 0;
  background-color: white;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 101;
  border-radius: 4px;
  overflow: hidden;
}

.header-user-dropdown:hover .dropdown-content {
  display: block;
}

.header-go-user-profile,
.header-go-to-my-orders,
.header-logout-btn {
  color: #333;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
  width: 100%;
  text-align: left;
  border: none;
  background: none;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.header-go-user-profile:hover,
.header-go-to-my-orders:hover,
.header-logout-btn:hover {
  background-color: #f1f1f1;
}

.header-logout-btn {
  color: #e74c3c;
}

.header-go-to-my-orders {
  color: #3498db;
}
</style>