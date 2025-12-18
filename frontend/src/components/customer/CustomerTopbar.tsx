import { Link } from '@tanstack/react-router'
import { Search, MapPin, ShoppingCart, LogOut } from 'lucide-react'
import { useCartStore } from '@/store/useCartStore'
import { useAuth, useLogoutMutation } from '@/auth/provider' // 👈 Import auth hooks
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export default function CustomerTopbar() {
  const { user } = useAuth()
  const logoutMutation = useLogoutMutation()
  const cartItems = useCartStore((state) => state.items)
  const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0)

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success('Logged out successfully')
      },
    })
  }

  return (
    <header className="h-16 bg-white border-b border-slate-100 px-8 flex items-center justify-between sticky top-0 z-50">
      {/* LEFT SECTION: Logo & Location */}
      <div className="flex items-center gap-8">
        <Link
          to="/customer"
          className="text-2xl font-black tracking-tighter flex items-center shrink-0"
        >
          <span className="text-red-600 italic">YU</span>
          <span className="text-black ml-0.5">Eats</span>
        </Link>

        <div className="hidden md:flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-full text-sm font-bold cursor-pointer">
          <MapPin size={16} className="text-red-600" />
          <span>Campus Center • Now</span>
        </div>
      </div>

      {/* MIDDLE SECTION: Search Bar */}
      <div className="flex-1 max-w-2xl mx-12 hidden lg:block">
        <div className="relative text-slate-400">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2"
            size={18}
          />
          <input
            type="text"
            placeholder="Search for restaurants or dishes"
            className="w-full bg-slate-100 py-2.5 pl-12 pr-4 rounded-full border-none focus:ring-2 focus:ring-red-600 outline-none transition-all"
          />
        </div>
      </div>

      {/* RIGHT SECTION: Cart, Name, & Logout */}
      <div className="flex items-center gap-6">
        <Link
          to="/customer/checkout"
          className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-full font-bold hover:bg-slate-800 transition-all text-sm"
        >
          <ShoppingCart size={18} />
          <span>Cart • {totalQuantity}</span>
        </Link>

        <div className="flex items-center gap-4 border-l pl-6 border-slate-100">
          {/* User Identity */}
          <div className="flex flex-col items-end">
            <span className="text-[10px] uppercase font-black text-slate-400 leading-none">
              Customer
            </span>
            <span className="text-sm font-bold text-slate-900">
              {user?.firstName}
            </span>
          </div>

          {/* Logout Trigger */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
            className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            {logoutMutation.isPending ? (
              <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
            ) : (
              <LogOut size={18} />
            )}
          </Button>
        </div>
      </div>
    </header>
  )
}
