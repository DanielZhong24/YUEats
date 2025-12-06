import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/vendor')({
  component: VendorLayout,
})

function VendorLayout() {
  return (
    <div className="min-h-screen flex justify-center items-center">
      <h2>Vendor Dashboard</h2>
      <Outlet />
    </div>
  )
}
