import { createFileRoute, Outlet } from '@tanstack/react-router'
import Sidebar from '@/components/vendor/Sidebar'
import Topbar from '@/components/vendor/Topbar'
import { VendorProvider } from '@/context/VendorContext' // 👈 Import this
import { redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/vendor')({
  beforeLoad: ({ context }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: '/auth',
        search: { redirect: window.location.pathname },
      })
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
