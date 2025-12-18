import { useMutation, useQueryClient } from '@tanstack/react-query'
import { router } from '../router'
import { useAuth } from './provider'
import type {
  AppUser,
  SignupPayload,
  VendorSignupPayload,
  SignupResponse,
  LoginPayload,
} from './types'

const checkBackendUrl = () => {
  if (!import.meta.env.VITE_BACKEND_URL) {
    throw new Error('VITE_BACKEND_URL is not defined in environment variables')
  }
}

// Core API functions
const signupApi = async (
  userType: 'vendors' | 'customers',
  payload: SignupPayload | VendorSignupPayload,
): Promise<SignupResponse> => {
  checkBackendUrl()
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/${userType}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    },
  )

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(
      error.message || `Signup failed with status ${response.status}`,
    )
  }

  return response.json()
}

const loginApi = async (payload: LoginPayload): Promise<AppUser> => {
  checkBackendUrl()
  const formData = new URLSearchParams()
  formData.append('username', payload.email)
  formData.append('password', payload.password)

  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData,
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error('Authentication failed')
  }

  const userResponse = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/users/me`,
    {
      credentials: 'include',
    },
  )

  if (!userResponse.ok) {
    throw new Error('Failed to fetch user data')
  }

  return userResponse.json()
}

const logoutApi = async (): Promise<void> => {
  checkBackendUrl()
  await fetch(`${import.meta.env.VITE_BACKEND_URL}/logout`, {
    method: 'POST',
    credentials: 'include',
  })
}

// Custom mutation hooks
export function useSignupMutation() {
  const { setUser, setIsAuthenticated } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      userType,
      payload,
    }: {
      userType: 'vendors' | 'customers'
      payload: SignupPayload | VendorSignupPayload
    }) => signupApi(userType, payload),
    onSuccess: async (_data, variables) => {
      // Auto-login after successful signup
      try {
        const userData = await loginApi({
          email: variables.payload.email,
          password: variables.payload.password,
        })
        setUser(userData)
        setIsAuthenticated(true)
        queryClient.invalidateQueries({ queryKey: ['user'] })
      } catch (error) {
        console.error('Auto-login after signup failed:', error)
        // Still invalidate queries even if auto-login fails
        queryClient.invalidateQueries({ queryKey: ['users'] })
      }
    },
  })
}

export function useLoginMutation() {
  const { setUser, setIsAuthenticated } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: LoginPayload) => loginApi(payload),
    onSuccess: (userData) => {
      setUser(userData)
      setIsAuthenticated(true)
      queryClient.invalidateQueries({ queryKey: ['user'] })
    },
  })
}

export function useLogoutMutation() {
  const { setUser, setIsAuthenticated } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: logoutApi,
    onSuccess: () => {
      setUser(null)
      setIsAuthenticated(false)
      queryClient.clear()

      router.navigate({ to: '/auths', search: { redirect: '/' } })
    },
  })
}
