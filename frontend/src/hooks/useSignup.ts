import { signupUser } from '@/lib/auth'
import { SignupPayload, SignupResponse } from '@/types/users'
import { useMutation, UseMutationOptions } from '@tanstack/react-query'

interface UseSignupOptions extends Omit<
  UseMutationOptions<SignupResponse, Error, SignupPayload>,
  'mutationFn'
> {
  userType: 'vendors' | 'customers'
}

export const useSignup = ({ userType, ...options }: UseSignupOptions) => {
  return useMutation<SignupResponse, Error, SignupPayload>({
    mutationFn: (payload) => signupUser(userType, payload),
    ...options,
  })
}
