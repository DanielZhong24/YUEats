// User Role Types
export type UserRole = 'CUSTOMER' | 'VENDOR' | 'DRIVER'

// Base User Interface
export interface User {
  id: number
  email: string
  firstName: string
  lastName: string
  phoneNumber: string
  userRole: UserRole
  isVerified: boolean
}

// Specific User Types
export interface Customer extends User {
  userRole: 'CUSTOMER'
}

export interface Vendor extends User {
  userRole: 'VENDOR'
  businessName: string
  ownedRestaurants?: Restaurant[]
}

export interface Driver extends User {
  userRole: 'DRIVER'
}

// Discriminated Union of All User Types
export type AppUser = Customer | Vendor | Driver

// Restaurant Interface
export interface Restaurant {
  id: number
  restaurantName: string
  address: string
}

// Login Request Interface
export interface LoginPayload {
  email: string
  password: string
}

// Signup Request Interfaces
export interface SignupPayload {
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  password: string
}

export interface VendorSignupPayload extends SignupPayload {
  businessName: string
}

// Signup Response Interface
export interface SignupResponse extends User {
  businessName?: string
  ownedRestaurants?: Restaurant[]
}
