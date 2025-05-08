import { useState } from 'nuxt/app'
import { onMounted } from 'vue'

interface User {
  username: string
  // 添加其他用户属性
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

  // 自动获取用户信息
  onMounted( () => {
    if (!user.value) {
      fetchUser()
    }
  })

  // 刷新用户状态
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