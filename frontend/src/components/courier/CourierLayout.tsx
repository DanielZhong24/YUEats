import { ReactNode } from 'react'
import CourierTopbar from '@/components/courier/CourierTopbar'

interface CourierLayoutProps {
  children: ReactNode
}

export default function CourierLayout({ children }: CourierLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Specialized Topbar for Couriers */}
      <CourierTopbar />

      <div className="flex flex-1 justify-center">
        {/* Main Content Area - often centered for mobile-first courier use */}
        <main className="flex-1 max-w-5xl w-full p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}