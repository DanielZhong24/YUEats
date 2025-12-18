import { useRestaurants } from '@/hooks/useCustomerApi'
import { Link } from '@tanstack/react-router'
import { Clock } from 'lucide-react'
export default function CustomerDashboard() {
  const { data: restaurants } = useRestaurants()
  const restaurantList = Array.isArray(restaurants) ? restaurants : []

  return (
    <div className="p-8 max-w-350 mx-auto space-y-12">
      <h2 className="text-3xl font-black text-slate-900">
        Available for Pickup
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {restaurantList.map((rest: any) => (
          <Link
            key={rest.id}
            to="/customer/restaurant/$restaurantId"
            params={{ restaurantId: rest.id.toString() }}
            className="group cursor-pointer"
          >
            <div className="relative aspect-16/10 rounded-2xl overflow-hidden mb-4 shadow-sm group-hover:shadow-md transition-all">
              <img
                src={
                  rest.bannerImgUrl ||
                  'https://images.unsplash.com/photo-1513104890138-7c749659a591'
                }
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            <h4 className="font-bold text-lg text-slate-900">
              {rest.restaurantName}
            </h4>
            <p className="text-sm text-slate-500 font-bold flex items-center gap-1.5 mt-1">
              <Clock size={16} className="text-green-600" />
              15–25 min • {rest.address || 'Pickup'}
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}
