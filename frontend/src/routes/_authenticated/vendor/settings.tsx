import { createFileRoute } from '@tanstack/react-router'
import VendorSettingsPage from '@/components/vendor/VendorSettingsPage'

export const Route = createFileRoute('/_authenticated/vendor/settings')({
  component: VendorSettingsPage,
})