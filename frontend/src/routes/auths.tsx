import { AuthForm } from '@/components/forms/auth-form'
import { createFileRoute } from '@tanstack/react-router'
import { toast } from 'sonner'
import { useSignupMutation } from '@/auth/provider'

export const Route = createFileRoute('/auths')({
  validateSearch: (search) => ({
    redirect: (search.redirect as string) || '/',
  }),
  component: AuthPage,
})

function AuthPage() {
  const signupMutation = useSignupMutation()

  const handleSubmit = async (data: {
    firstName: string
    lastName: string
    businessName: string
    email: string
    phoneNumber: string
    password: string
  }) => {
    signupMutation.mutate(
      { userType: 'vendors', payload: data },
      {
        onSuccess: () => {
          toast.success('Account Created Successfully!', {
            description: 'You can now log in with your credentials.',
          })
        },
        onError: (error) => {
          toast.error('Signup failed!', {
            description: error.message || 'Could not connect to the server',
          })
        },
      },
    )
  }

  return (
    <div className="flex flex-col items-center justify-center gap-6 p-6 bg-muted min-h-svh md:p-10">
      <div className="flex flex-col w-full max-w-sm gap-6">
        <AuthForm
          onSubmit={handleSubmit}
          isPending={signupMutation.isPending}
        />
      </div>
    </div>
  )
}
