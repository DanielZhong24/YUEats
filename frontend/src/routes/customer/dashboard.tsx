import { createFileRoute } from '@tanstack/react-router'
import CustomerDashboard from '@/components/customer/CustomerDashboard'

// Path must be exactly '/customer/dashboard'
export const Route = createFileRoute('/customer/dashboard')({
  component: CustomerDashboard,
})