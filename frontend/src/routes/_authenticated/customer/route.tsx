import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import CustomerTopbar from '@/components/customer/CustomerTopbar'

export const Route = createFileRoute('/_authenticated/customer')({
  beforeLoad: ({ context }) => {
    // 1. Check if authenticated
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: '/auth',
        search: { mode: 'login', redirect: '/customer' },
      })
    }

    // 2. Strict Role Check: Only CUSTOMER allowed
    if (context.auth.user?.userRole !== 'CUSTOMER') {
      // Logic: Send them to their own dashboard instead of just Home
      const rolePath = context.auth.user?.userRole.toLowerCase();
      throw redirect({ 
        to: `/${rolePath}` as any 
      })
    }
  },
  component: CustomerLayout,
})

function CustomerLayout() {
  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans">
      <CustomerTopbar />
      <div className="flex flex-1">
        <main className="flex-1 bg-white">
          <Outlet />
        </main>
      </div>
    </div>
  )
}