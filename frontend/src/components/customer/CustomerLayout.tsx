import { Link } from '@tanstack/react-router'
import { Home, ClipboardList, ShoppingBag, LogOut,Activity } from 'lucide-react'

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* SIDEBAR */}

    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col fixed h-full z-30">
 

      <nav className="flex-1 px-4 space-y-2">
        <Link 
          to="/customer" 
          activeOptions={{ exact: true }} 
          className="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-50 [&.active]:bg-red-50 [&.active]:text-red-600 transition-all"
        >
          <Home size={20} /> <span>Home</span>
        </Link>
        
        <Link 
          to="/customer/orders" 
          className="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-50 [&.active]:bg-red-50 [&.active]:text-red-600 transition-all"
        >
          <Activity size={20} /> <span>Live Status</span>
        </Link>
      </nav>
    </aside>

      {/* CONTENT AREA */}
      <main className="flex-1 ml-64 p-8">
        {children}
      </main>
    </div>
  )
}