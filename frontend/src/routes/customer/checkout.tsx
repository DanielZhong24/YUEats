import { createFileRoute } from '@tanstack/react-router'
import CheckoutPage from '@/components/customer/CheckoutPage'

export const Route = createFileRoute('/customer/checkout')({
  component: CheckoutPage,
})