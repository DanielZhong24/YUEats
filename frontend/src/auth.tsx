import React, { createContext, useContext, useState, useEffect } from 'react'

interface User {
  id: string
  username: string
  email: string
}

interface AuthState {
  isAuthenticated: boolean
  user: User | null
  login: (username: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthState | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Restore auth state on app load
  useEffect(() => {
    // Check if user is authenticated by calling /users/me
    fetch('/users/me', {
      credentials: 'include', // Important: include cookies
    })
      .then((response) => {
        if (response.ok) {
          return response.json()
        }
        throw new Error('Not authenticated')
      })
      .then((userData) => {
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

  const login = async (username: string, password: string) => {
    // Spring Security expects form data, not JSON
    const formData = new URLSearchParams()
    formData.append('username', username)
    formData.append('password', password)

    const response = await fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
      credentials: 'include', // Important: include cookies
    })

    if (response.ok) {
      // Fetch user data after successful login
      const userResponse = await fetch('/users/me', {
        credentials: 'include',
      })

      if (userResponse.ok) {
        const userData = await userResponse.json()
        setUser(userData)
        setIsAuthenticated(true)
      } else {
        throw new Error('Failed to fetch user data')
      }
    } else {
      throw new Error('Authentication failed')
    }
  }

  const logout = async () => {
    try {
      await fetch('/logout', {
        method: 'POST',
        credentials: 'include',
      })
    } finally {
      setUser(null)
      setIsAuthenticated(false)
    }
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
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
