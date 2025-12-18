import { createFileRoute } from '@tanstack/react-router'
import VendorSettingsPage from '@/components/vendor/VendorSettingsPage'

export const Route = createFileRoute('/vendor/settings')({
  component: VendorSettingsPage,
})