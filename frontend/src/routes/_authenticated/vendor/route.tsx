import { createFileRoute, Outlet } from '@tanstack/react-router'
import Sidebar from '@/components/vendor/Sidebar'
import Topbar from '@/components/vendor/Topbar'
import { VendorProvider } from '@/context/VendorContext' // 👈 Import this
import { redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/vendor')({
  beforeLoad: ({ context }) => {
    // 1. First check: Is anyone logged in?
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: '/auth',
        search: { redirect: window.location.pathname, mode: 'login' },
      })
    }

    // 2. Second check: Is this user a VENDOR?
    if (context.auth.user?.userRole !== 'VENDOR') {
      throw redirect({ to: '/' }) // Strict block for Customers/Couriers
    }
  },
  component: VendorLayout,
})

function VendorLayout() {
  return (
    // 👇 1. Wrap the entire layout
    <VendorProvider>
      <div className="min-h-screen flex bg-slate-50 dark:bg-slate-900">
        <Sidebar />

        <div className="flex-1 flex flex-col">
          <Topbar />
          <main className="p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </VendorProvider>
  )
}
