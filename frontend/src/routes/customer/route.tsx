import { createFileRoute, Outlet } from '@tanstack/react-router'
import CustomerTopbar from '@/components/customer/CustomerTopbar'

export const Route = createFileRoute('/customer')({
  component: CustomerLayout,
})

function CustomerLayout() {
  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans">
      {/* 1. Modular Topbar */}
      <CustomerTopbar />

      <div className="flex flex-1">


        {/* 3. Main Center Area */}
        <main className="flex-1 bg-white">
          <Outlet />
        </main>
      </div>
    </div>
  )
}