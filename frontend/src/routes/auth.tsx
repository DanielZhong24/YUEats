import { useLoginMutation, useSignupMutation } from '@/auth/provider'
import type {
  LoginPayload,
  SignupPayload,
  VendorSignupPayload,
  CourierSignupPayload,
  SignupData,
} from '@/auth/types'
import { AuthCard } from '@/components/auth-card'
import { createFileRoute, redirect, useRouter } from '@tanstack/react-router'
import { toast } from 'sonner'

export const Route = createFileRoute('/auth')({
  validateSearch: (search) => ({
    redirect: (search.redirect as string) || '/',
    mode:(search.mode as 'login'|'signup')||'login'
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
  const {mode} = Route.useSearch()
  const router = useRouter()
  const signupMutation = useSignupMutation()
  const loginMutation = useLoginMutation()

  const handleSignup = async (data: SignupData) => {
    // Determine the user type endpoint based on userRole
    const userRole = data.userRole || 'CUSTOMER'
    let userType: 'vendors' | 'customers' | 'couriers'

    if (userRole === 'VENDOR') {
      userType = 'vendors'
    } else if (userRole === 'COURIER') {
      userType = 'couriers'
    } else {
      userType = 'customers'
    }

    const { userRole: _, ...payloadData } = data
    const payload: SignupPayload | VendorSignupPayload | CourierSignupPayload =
      userRole === 'VENDOR'
        ? (payloadData as VendorSignupPayload)
        : (payloadData as SignupPayload)

    signupMutation.mutate(
      { userType, payload },
      {
        onSuccess: () => {
          toast.success('Account Created Successfully!', {
            description: 'Welcome to YUEats!',
          })
          // Navigate based on user type
          if (userRole === 'VENDOR') {
            router.navigate({ to: '/vendor' })
          } else if(userRole === 'COURIER') {
            router.navigate({ to: '/courier' })
          }else{
            router.navigate({ to: '/customer' })

          }
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
      onSuccess: (userData) => {
        toast.success('Login Successful!', {
          description: 'Welcome back to YUEats!',
        })
        // Navigate based on user role
        if (userData.userRole === 'VENDOR') {
          router.navigate({ to: '/vendor' })
        }else if(userData.userRole === 'COURIER'){
          router.navigate({to: '/courier'})
        } else {
          router.navigate({ to: '/customer' })
        }


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
          defaultMode={mode}
          onSignup={handleSignup}
          onLogin={handleLogin}
          isPending={signupMutation.isPending || loginMutation.isPending}
        />
      </div>
    </div>
  )
}
