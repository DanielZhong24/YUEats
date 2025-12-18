import { createFileRoute } from '@tanstack/react-router'
import CustomerLayout from '@/components/customer/CustomerLayout'
import CustomerDashboard from '@/components/customer/CustomerDashboard'

export const Route = createFileRoute('/_authenticated/customer/')({
  component: () => (
    <CustomerLayout>
      <CustomerDashboard />
    </CustomerLayout>
  ),
})