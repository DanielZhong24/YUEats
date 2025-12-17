export type SignupPayload = {
  firstName: string
  lastName: string
  businessName?: string
  email: string
  phoneNumber: string
  password: string
}

export type SignupResponse = {
  id: number
  email: string
  passwordHash: string
  firstName: string
  lastName: string
  phoneNumber: string
  userRole: 'VENDOR' | 'CUSTOMER'
  isVerified: boolean
  businessName?: string
  ownedRestaurants?: any[]
}

export type VendorSignup = Omit<SignupPayload, 'businessName'> & {
  businessName: string
}

export type VendorSignupPayload = Omit<VendorSignup, 'passwordConfirm'>

export type CustomerSignup = Omit<SignupPayload, 'businessName'>

export type CustomerSignupPayload = Omit<CustomerSignup, 'passwordConfirm'>
