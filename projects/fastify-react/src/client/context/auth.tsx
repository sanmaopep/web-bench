import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface User {
  username: string
  role: string
  coin: number
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: () => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchUser = async () => {
    try {
      const response = await fetch('/api/auth')
      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
      } else {
        setUser(null)
      }
    } catch (error) {
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUser()
  }, [])

  const login = async () => {
    await fetchUser()
  }

  const logout = async () => {
    // Implement logout functionality when available
    setUser(null)
  }

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
  }

  return (
    <AuthContext.Provider value={value}>
      {isLoading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
