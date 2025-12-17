import { SignupPayload, SignupResponse } from '../types/users'

export const signupUser = async (
  userType: 'vendors' | 'customers',
  payload: SignupPayload,
): Promise<SignupResponse> => {
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
    console.log('Signup error response:', error)
    throw new Error(
      error.message || `Signup failed with status ${response.status}`,
    )
  }

  return response.json()
}
