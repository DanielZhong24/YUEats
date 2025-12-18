import { useLoginMutation, useSignupMutation } from '@/auth/provider'
import type { LoginPayload, VendorSignupPayload } from '@/auth/types'
import { AuthCard } from '@/components/auth-card'
import { createFileRoute, redirect, useRouter } from '@tanstack/react-router'
import { toast } from 'sonner'

export const Route = createFileRoute('/auths')({
  validateSearch: (search) => ({
    redirect: (search.redirect as string) || '/',
  }),
  beforeLoad: ({ context, search }) => {
    // Redirect if already authenticated
    if (context.auth.isAuthenticated) {
      throw redirect({ to: search.redirect as any })
    }
  },
  component: AuthPage,
})

function AuthPage() {
  const router = useRouter()
  const signupMutation = useSignupMutation()
  const loginMutation = useLoginMutation()

  const handleSignup = async (data: VendorSignupPayload) => {
    signupMutation.mutate(
      { userType: 'vendors', payload: data },
      {
        onSuccess: () => {
          toast.success('Account Created Successfully!', {
            description: 'Welcome to YUEats!',
          })
          router.navigate({ to: '/dashboard' })
        },
        onError: (error) => {
          toast.error('Signup failed!', {
            description: error.message || 'Could not connect to the server',
          })
        },
      },
    )
  }

  const handleLogin = async (data: LoginPayload) => {
    loginMutation.mutate(data, {
      onSuccess: () => {
        toast.success('Login Successful!', {
          description: 'Welcome back to YUEats!',
        })
        router.navigate({ to: '/dashboard' })
      },
      onError: (error) => {
        toast.error('Login failed!', {
          description: error.message || 'Invalid credentials',
        })
      },
    })
  }

  return (
    <div className="flex flex-col items-center justify-center gap-6 p-6 bg-muted min-h-svh md:p-10">
      <div className="flex flex-col w-full max-w-sm gap-6">
        <AuthCard
          onSignup={handleSignup}
          onLogin={handleLogin}
          isPending={signupMutation.isPending || loginMutation.isPending}
        />
      </div>
    </div>
  )
}
