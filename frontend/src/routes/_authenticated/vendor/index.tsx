// routes/vendor/index.tsx
import { createFileRoute } from '@tanstack/react-router'
import Dashboard from '@/components/vendor/Dashboard/Dashboard'

export const Route = createFileRoute('/_authenticated/vendor/')({
  component: Dashboard,
})
