import { createFileRoute } from '@tanstack/react-router'
import CourierLayout from '@/components/courier/CourierLayout'
import CourierDashboard from '@/components/courier/CourierDashboard'

export const Route = createFileRoute('/_authenticated/courier/')({
  component: () => (
    <CourierLayout>
      <CourierDashboard />
    </CourierLayout>
  ),
})