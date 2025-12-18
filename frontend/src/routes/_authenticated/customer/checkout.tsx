import { createFileRoute } from '@tanstack/react-router'
import CheckoutPage from '@/components/customer/CheckoutPage'

export const Route = createFileRoute('/_authenticated/customer/checkout')({
  component: CheckoutPage,
})