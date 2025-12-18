import { createFileRoute } from '@tanstack/react-router'
import VendorPrepPage from '@/components/vendor/VenderPrepPage';
export const Route = createFileRoute('/_authenticated/vendor/prep')({
  component: VendorPrepPage,
})


