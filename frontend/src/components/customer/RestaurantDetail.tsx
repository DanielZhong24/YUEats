import { useParams, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import * as customerService from '@/services/customer'
import { Plus, Clock, Star, ShoppingBag } from 'lucide-react'
import { useCartStore } from '@/store/useCartStore'

export default function RestaurantDetail() {
  // FIX: The 'from' path must match the route definition exactly
  const { restaurantId } = useParams({
    from: '/_authenticated/customer/restaurant/$restaurantId',
  })

  const addItem = useCartStore((state) => state.addItem)
  const cartItems = useCartStore((state) => state.items)
  const cartTotal = useCartStore((state) => state.getTotal())
  const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0)

  const { data: restaurants } = useQuery({
    queryKey: ['restaurants'],
    queryFn: customerService.getRestaurants,
    staleTime: 1000 * 60 * 5,
  })

  const restaurant = restaurants?.find(
    (r: any) => r.id.toString() === restaurantId,
  )

  const { data: menuItems, isLoading } = useQuery({
    queryKey: ['menu', restaurantId],
    queryFn: () => customerService.getRestaurantMenu(restaurantId),
  })

  return (
    <div className="min-h-screen bg-white pb-32">
      <div className="h-70 w-full relative bg-slate-100">
        <img
          src={
            restaurant?.bannerImgUrl ||
            'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2000'
          }
          alt={restaurant?.restaurantName}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/10" />
      </div>

      <div className="max-w-250 mx-auto px-8 -mt-12 relative z-10">
        <div className="bg-white p-8 rounded-xl shadow-xl border border-slate-100">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-black text-slate-900 mb-2">
                {restaurant?.restaurantName || 'Loading...'}
              </h1>
              <div className="flex items-center gap-3 text-sm font-bold text-slate-600">
                <span className="flex items-center gap-1 text-black">
                  <Star size={16} className="fill-black" /> 4.8 (200+ ratings)
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6 mt-6 pt-6 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <Clock size={18} className="text-green-600" />
              <span className="text-sm font-bold">15–25 min</span>
            </div>
            <div className="flex items-center gap-2 text-slate-500">
              <ShoppingBag size={18} />
              <span className="text-sm font-bold">
                Pickup at {restaurant?.address || 'Campus Center'}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-black mb-8">Full Menu</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
            {isLoading
              ? [1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-32 bg-slate-50 rounded-xl animate-pulse"
                  />
                ))
              : menuItems?.map((item: any) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center pb-6 border-b border-slate-100 group"
                  >
                    <div className="flex-1 pr-4">
                      <h4 className="font-bold text-[17px] mb-1">
                        {item.itemName}
                      </h4>
                      <p className="text-sm text-slate-500 line-clamp-2 mb-2">
                        {item.description || 'No description available.'}
                      </p>
                      <p className="font-bold text-slate-900">
                        ${item.price.toFixed(2)}
                      </p>
                    </div>
                    <div className="relative w-32 h-32 bg-slate-100 rounded-lg overflow-hidden shrink-0">
                      <img
                        src={item.imgUrl}
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => addItem(item, Number(restaurantId))}
                        className="absolute bottom-2 right-2 bg-white p-1.5 rounded-full shadow-lg hover:bg-black hover:text-white transition-all active:scale-90"
                      >
                        <Plus size={20} />
                      </button>
                    </div>
                  </div>
                ))}
          </div>
        </div>
      </div>

      {cartItems.length > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-125 px-4 z-50">
          <Link
            to="/customer/checkout"
            className="w-full bg-black text-white flex items-center justify-between px-8 py-4 rounded-xl shadow-2xl hover:bg-slate-800 transition-all"
          >
            <div className="bg-white/20 px-2.5 py-1 rounded text-sm font-bold">
              {totalQuantity}
            </div>
            <span className="font-bold text-lg">View Cart</span>
            <span className="font-bold">${cartTotal.toFixed(2)}</span>
          </Link>
        </div>
      )}
    </div>
  )
}
