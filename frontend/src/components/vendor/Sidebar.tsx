import { Link } from '@tanstack/react-router'
import {
  LayoutDashboard,
  UtensilsCrossed,
  Timer,
  Settings,
  HelpCircle,
  LogOut,
} from 'lucide-react'
import { useLogoutMutation } from '@/auth/hooks'

// Helper to center icons (Simplified)
function Icon({ children }: { children: React.ReactNode }) {
  return (
    <span className="w-6 h-6 inline-flex items-center justify-center text-slate-500 dark:text-slate-400 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
      {children}
    </span>
  )
}

export default function Sidebar() {
  const logoutMutation = useLogoutMutation()

  return (
    <aside className="w-64 min-h-screen bg-white dark:bg-slate-800 border-r dark:border-slate-700 p-6 shadow-sm flex flex-col h-full">
      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Vendor
        </h2>
        <div className="text-sm text-slate-400 mt-1">
          Manage your restaurant operations
        </div>
      </div>

      <nav className="flex flex-col gap-2 flex-1">
        <Link
          to="/vendor"
          activeOptions={{ exact: true }}
          activeProps={{
            className:
              'bg-blue-50 text-blue-700 dark:bg-slate-700 dark:text-blue-400 font-semibold',
          }}
          className="group flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-all"
        >
          <Icon>
            <LayoutDashboard size={20} />
          </Icon>
          <span>Dashboard</span>
        </Link>

        <Link
          to="/vendor/menu"
          activeProps={{
            className:
              'bg-blue-50 text-blue-700 dark:bg-slate-700 dark:text-blue-400 font-semibold',
          }}
          className="group flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-all"
        >
          <Icon>
            <UtensilsCrossed size={20} />
          </Icon>
          <span>Menu</span>
        </Link>

        {/* <Link 
          to="/vendor/analytics" 
          activeProps={{ className: 'bg-blue-50 text-blue-700 dark:bg-slate-700 dark:text-blue-400 font-semibold' }}
          className="group flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-all"
        >
          <Icon><BarChart3 size={20} /></Icon>
          <span>Analytics</span>
        </Link> */}

        <Link
          to="/vendor/prep"
          activeProps={{
            className:
              'bg-blue-50 text-blue-700 dark:bg-slate-700 dark:text-blue-400 font-semibold',
          }}
          className="group flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-all"
        >
          <Icon>
            <Timer size={20} />
          </Icon>
          <span>Prep Timer</span>
        </Link>
      </nav>

      {/* Footer Links (Optional but nice to have clickable) */}
      <div className="mt-auto pt-6 border-t dark:border-slate-700 space-y-2">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
          Support
        </div>
        <Link
          to="/vendor/settings"
          activeProps={{
            className:
              'bg-blue-50 text-blue-700 dark:bg-slate-700 dark:text-blue-400 font-semibold',
          }}
          className="group flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-all text-sm"
        >
          <Icon>
            <Settings size={18} />
          </Icon>
          <span>Settings</span>
        </Link>

        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 group text-sm">
          <Icon>
            <HelpCircle size={18} />
          </Icon>
          <span>Help Center</span>
        </button>
        <button
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 group text-sm"
          onClick={() => logoutMutation.mutate()}
        >
          <Icon>
            <LogOut size={18} />
          </Icon>
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  )
}
