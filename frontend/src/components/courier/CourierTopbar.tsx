import { Link } from '@tanstack/react-router'
import { LogOut, Zap } from 'lucide-react'
import { useAuth, useLogoutMutation } from '@/auth/provider'
import { Button } from '@/components/ui/button'

export default function CourierTopbar() {
  const { user } = useAuth()
  const logoutMutation = useLogoutMutation()

  return (
    <header className="h-16 bg-slate-900 text-white px-6 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <Link
          to="/courier"
          className="text-xl font-black italic tracking-tighter"
        >
          <span className="text-red-500">YU</span>Eats{' '}
          <span className="text-[10px] bg-red-600 px-2 py-0.5 rounded-full not-italic ml-2">
            COURIER
          </span>
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden sm:flex flex-col items-end mr-2">
          <span className="text-xs font-bold text-slate-400">
            {user?.firstName}
          </span>
          <span className="text-[9px] text-green-500 font-black uppercase flex items-center gap-1">
            <Zap size={8} fill="currentColor" /> Online
          </span>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => logoutMutation.mutate()}
          className="hover:bg-red-600/20 hover:text-red-500 text-slate-400"
        >
          <LogOut size={20} />
        </Button>
      </div>
    </header>
  )
}
