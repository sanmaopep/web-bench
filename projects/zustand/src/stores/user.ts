import { create } from 'zustand'

interface UserState {
  username: string | null
  isLoggedIn: boolean
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
}

const useUserStore = create<UserState>((set) => ({
  username: null,
  isLoggedIn: false,
  login: async (username, password) => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })
      const data = await response.json()
      
      if (data.success) {
        set({ username, isLoggedIn: true })
        return true
      }
      return false
    } catch (error) {
      console.error('Login error:', error)
      return false
    }
  },
  logout: () => {
    set({ username: null, isLoggedIn: false })
  }
}))

export default useUserStore