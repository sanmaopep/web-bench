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
  <NuxtLayout>
    <div class="error-container">
      <h1>Oops! Looks like you have wandered off the beaten path.</h1>
      <NuxtLink to="/" class="not-found-go-to-home">Go Back Home</NuxtLink>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
// Redirect to login if trying to access admin pages without permission
const route = useRoute()
const router = useRouter()
const { data: currentUser } = await useFetch<{ role: string }>('/api/simple_auth')

onMounted(async () => {
  if (route.path.startsWith('/admin') && currentUser.value?.role !== 'admin') {
    router.push('/login')
  }
})
</script>

<style scoped>
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
}

h1 {
  color: #e74c3c;
  margin-bottom: 2rem;
  font-size: 1.8rem;
}
.not-found-go-to-home {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
  position: relative;
  z-index: 1;
  pointer-events: auto;
  text-decoration: none;
  display: inline-block;
}

.not-found-go-to-home:hover {
  background-color: #2980b9;
}
</style>
