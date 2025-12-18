import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/customer/')({
  beforeLoad: () => {
    throw redirect({ to: '/customer/dashboard' })
  },
})