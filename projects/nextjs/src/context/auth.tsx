'use client'

import { createContext, useCallback, useContext, useState } from 'react'
import { getCurrentUser } from '@/actions/auth'

export interface Auth {
  username?: string
  role?: string
}

export interface AuthContextType {
  auth?: Auth
  refreshAuth: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType>(null!)

export const AuthProvider = ({ children, initAuth }) => {
  const [auth, setAuth] = useState<Auth | undefined>(initAuth)

  const refreshAuth = useCallback(async () => {
    const auth = await getCurrentUser()
    setAuth(auth || {})
  }, [])

  return (
    <AuthContext.Provider
      value={{
        auth,
        refreshAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(AuthContext)
}
