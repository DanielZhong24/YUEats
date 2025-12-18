import React, { createContext, useContext, useEffect, useState } from 'react'
import type { AppUser } from './types'

const checkBackendUrl = () => {
  if (!import.meta.env.VITE_BACKEND_URL) {
    throw new Error('VITE_BACKEND_URL is not defined in environment variables')
  }
}

export interface AuthState {
  isAuthenticated: boolean
  user: AppUser | null
  setUser: (user: AppUser | null) => void
  setIsAuthenticated: (isAuthenticated: boolean) => void
}

const AuthContext = createContext<AuthState | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Restore auth state on app load
  useEffect(() => {
    checkBackendUrl()
    // Check if user is authenticated by calling /users/me
    fetch(`${import.meta.env.VITE_BACKEND_URL}/users/me`, {
      credentials: 'include', // Important: include cookies
    })
      .then((response) => {
        if (response.ok) {
          return response.json()
        }
        throw new Error('Not authenticated')
      })
      .then((userData: AppUser) => {
        setUser(userData)
        setIsAuthenticated(true)
      })
      .catch(() => {
        // User is not authenticated
        setUser(null)
        setIsAuthenticated(false)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    )
  }

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, setUser, setIsAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Re-export hooks from hooks.ts
export { useSignupMutation, useLoginMutation, useLogoutMutation } from './hooks'
