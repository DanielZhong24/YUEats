import { createFileRoute } from '@tanstack/react-router'
import CustomerLayout from '@/components/customer/CustomerLayout'
import OrdersPage from '@/components/customer/OrdersPage'

export const Route = createFileRoute('/_authenticated/customer/orders')({
  component: () => (
    <CustomerLayout>
      <OrdersPage />
    </CustomerLayout>
  ),
})