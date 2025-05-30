// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//     http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { useState } from 'nuxt/app'
import { onMounted } from 'vue'

interface User {
  username: string
  // Add other user attributes
}

export const useUser = () => {
  const user = useState<User | null>('user', () => null)
  const isLoading = useState<boolean>('userLoading', () => false)
  const error = useState<Error | null>('userError', () => null)

  const fetchUser = async () => {
    isLoading.value = true
    error.value = null
    try {
      const response = await $fetch<User>('/api/simple_auth')
      user.value = response
      return response
    } catch (err) {
      error.value = err as Error
      user.value = null
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Automatically fetch user information
  onMounted( () => {
    if (!user.value) {
      fetchUser()
    }
  })

  // Refresh user status
  const refreshAuth = async () => {
    return await fetchUser()
  }

  return {
    user,
    isLoading,
    error,
    refreshAuth
  }
}