// User Role Types
export type UserRole = 'CUSTOMER' | 'VENDOR' | 'COURIER'

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

export interface Courier extends User {
  userRole: 'COURIER'
}

// Discriminated Union of All User Types
export type AppUser = Customer | Vendor | Courier

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

export interface CourierSignupPayload extends SignupPayload {}

// Consolidated signup data type that can handle all user types
export interface SignupData {
  firstName: string
  lastName: string
  businessName?: string
  email: string
  phoneNumber: string
  password: string
  userRole?: UserRole
}

// Signup Response Interface
export interface SignupResponse extends User {
  businessName?: string
  ownedRestaurants?: Restaurant[]
}
