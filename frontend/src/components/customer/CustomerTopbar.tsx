import { Link } from '@tanstack/react-router'
import { Search, MapPin, ShoppingCart, User } from 'lucide-react'
import { useCartStore } from '@/store/useCartStore' // 👈 Import the store

export default function CustomerTopbar() {
  // Subscribe to the cart items
  const cartItems = useCartStore((state) => state.items)
  const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0)

  return (
    <header className="h-16 bg-white border-b border-slate-100 px-8 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-8">
        <Link to="/customer" className="text-2xl font-bold tracking-tighter flex items-center shrink-0">
          YU<span className="font-normal text-black ml-0.5">Eats</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-full text-sm font-bold cursor-pointer">
          <MapPin size={16} />
          <span>Campus Center • Now</span>
        </div>
      </div>

      <div className="flex-1 max-w-2xl mx-12 hidden lg:block">
        <div className="relative text-slate-400">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2" size={18} />
          <input 
            type="text" 
            placeholder="Search for restaurants or dishes" 
            className="w-full bg-slate-100 py-2.5 pl-12 pr-4 rounded-full border-none focus:ring-2 focus:ring-black outline-none"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* The Cart Button now shows the real-time count */}
        <Link 
          to="/customer/checkout" 
          className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-full font-bold hover:bg-slate-800 transition-all text-sm"
        >
          <ShoppingCart size={18} />
          <span>Cart • {totalQuantity}</span>
        </Link>
        
        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 cursor-pointer">
          <User size={20} />
        </div>
      </div>
    </header>
  )
}