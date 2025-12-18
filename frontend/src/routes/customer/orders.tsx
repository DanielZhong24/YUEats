import { createFileRoute } from '@tanstack/react-router'
import CustomerLayout from '@/components/customer/CustomerLayout'
import OrdersPage from '@/components/customer/OrdersPage'

export const Route = createFileRoute('/customer/orders')({
  component: () => (
    <CustomerLayout>
      <OrdersPage />
    </CustomerLayout>
  ),
})