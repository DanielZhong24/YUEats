import { createFileRoute, redirect } from '@tanstack/react-router'
import { useState } from 'react'
import { useLoginMutation } from '@/auth/provider'

export const Route = createFileRoute('/login')({
  validateSearch: (search) => ({
    redirect: (search.redirect as string) || '/',
  }),
  beforeLoad: ({ context, search }) => {
    // Redirect if already authenticated
    if (context.auth.isAuthenticated) {
      throw redirect({ to: search.redirect as any })
    }
  },
  component: AuthComponent,
})

function AuthComponent() {
  const { redirect: redirectPath } = Route.useSearch()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const loginMutation = useLoginMutation()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    loginMutation.mutate(
      { username, password },
      {
        onSuccess: () => {
          window.location.href = redirectPath
        },
      },
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="max-w-md w-full space-y-4 p-6 border rounded-lg"
      >
        <h1 className="text-2xl font-bold text-center">Sign In</h1>

        {loginMutation.isError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {loginMutation.error?.message || 'Invalid username or password'}
          </div>
        )}

        <div>
          <label htmlFor="username" className="block text-sm font-medium mb-1">
            Username
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loginMutation.isPending}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loginMutation.isPending ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </div>
  )
}
